-- Add user roles migration script
-- This adds a role field to user_profiles and sets up role-based permissions

-- Step 1: Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'tester' CHECK (role IN ('admin', 'tester'));

-- Step 2: Create an enum type for roles (optional, but good practice)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'tester');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Update existing users to have a default role
-- Set the first user (or specific users) as admin, others as tester
UPDATE user_profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id FROM user_profiles 
    ORDER BY created_at 
    LIMIT 1
);

-- Step 4: Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, avatar, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar',
    COALESCE(NEW.raw_user_meta_data->>'role', 'tester')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create indexes for role-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Step 6: Update RLS policies to include role-based access
-- For now, both roles can see everything (as requested)

-- Policy: All authenticated users can view all test progress
DROP POLICY IF EXISTS "Users can view all test progress" ON qa_user_test_progress;
CREATE POLICY "Users can view all test progress" ON qa_user_test_progress
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: All authenticated users can view all tests
DROP POLICY IF EXISTS "Users can view all tests" ON qa_tests;
CREATE POLICY "Users can view all tests" ON qa_tests
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: All authenticated users can view all user profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
CREATE POLICY "Users can view all profiles" ON user_profiles
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Users can only update their own profile
DROP POLICY IF EXISTS "Users can only update their own profile" ON user_profiles;
CREATE POLICY "Users can only update their own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 7: Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM user_profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM user_profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Add comments for documentation
COMMENT ON COLUMN user_profiles.role IS 'User role: admin or tester';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Get the role of a specific user';
COMMENT ON FUNCTION is_admin(UUID) IS 'Check if a user has admin role'; 