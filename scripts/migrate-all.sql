-- Comprehensive migration script for roles and test assignment
-- This script handles both migrations in the correct order

-- ========================================
-- PART 1: ADD USER ROLES
-- ========================================

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

-- ========================================
-- PART 2: ADD TEST ASSIGNMENT
-- ========================================

-- Step 6: Add assignment fields to qa_tests table
ALTER TABLE qa_tests 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Step 7: Create indexes for assignment queries
CREATE INDEX IF NOT EXISTS idx_qa_tests_assigned_to ON qa_tests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_qa_tests_assigned_at ON qa_tests(assigned_at);
CREATE INDEX IF NOT EXISTS idx_qa_tests_unassigned ON qa_tests(assigned_to) WHERE assigned_to IS NULL;

-- Step 8: Create a function to assign a test to a user
CREATE OR REPLACE FUNCTION assign_test_to_user(
  test_id TEXT,
  user_id UUID,
  assigned_by_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_assignment UUID;
BEGIN
  -- Check if test is already assigned
  SELECT assigned_to INTO current_assignment 
  FROM qa_tests 
  WHERE id = test_id;
  
  -- Only allow assignment if test is unassigned
  IF current_assignment IS NOT NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Assign the test
  UPDATE qa_tests 
  SET 
    assigned_to = user_id,
    assigned_at = NOW(),
    assigned_by = COALESCE(assigned_by_user_id, user_id)
  WHERE id = test_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create a function to unassign a test
CREATE OR REPLACE FUNCTION unassign_test(
  test_id TEXT,
  user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  current_assignment UUID;
BEGIN
  -- Check if test is assigned to the requesting user
  SELECT assigned_to INTO current_assignment 
  FROM qa_tests 
  WHERE id = test_id;
  
  -- Only allow unassignment if test is assigned to the requesting user
  IF current_assignment != user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Unassign the test
  UPDATE qa_tests 
  SET 
    assigned_to = NULL,
    assigned_at = NULL,
    assigned_by = NULL
  WHERE id = test_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create a function to check if user can modify test progress
CREATE OR REPLACE FUNCTION can_modify_test_progress(
  test_id TEXT,
  user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  test_assignment UUID;
BEGIN
  -- Check if test is assigned to the user
  SELECT assigned_to INTO test_assignment 
  FROM qa_tests 
  WHERE id = test_id;
  
  -- User can modify if they are assigned to the test
  RETURN test_assignment = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM user_profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM user_profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- PART 3: UPDATE RLS POLICIES
-- ========================================

-- Step 13: Update RLS policies for qa_tests
DROP POLICY IF EXISTS "Users can view all tests" ON qa_tests;
CREATE POLICY "Users can view all tests" ON qa_tests
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only assigned users can update test assignment
CREATE POLICY "Only assigned users can update test assignment" ON qa_tests
FOR UPDATE USING (
  auth.role() = 'authenticated' AND 
  (assigned_to = auth.uid() OR assigned_to IS NULL)
);

-- Step 14: Update RLS policies for qa_user_test_progress
DROP POLICY IF EXISTS "Users can view all test progress" ON qa_user_test_progress;
CREATE POLICY "Users can view all test progress" ON qa_user_test_progress
FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can only modify their own progress" ON qa_user_test_progress;
CREATE POLICY "Only assigned users can modify their own progress" ON qa_user_test_progress
FOR ALL USING (
  auth.role() = 'authenticated' AND 
  user_id = auth.uid() AND
  can_modify_test_progress(test_id, auth.uid())
);

-- Step 15: Update RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
CREATE POLICY "Users can view all profiles" ON user_profiles
FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can only update their own profile" ON user_profiles;
CREATE POLICY "Users can only update their own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- PART 4: CREATE VIEWS
-- ========================================

-- Step 16: Create a view for test assignments with user info
CREATE OR REPLACE VIEW test_assignments AS
SELECT 
  t.id as test_id,
  t.title,
  t.category,
  t.priority,
  t.steps,
  t.expected,
  t.edge_cases,
  t.assigned_to,
  t.assigned_at,
  t.assigned_by,
  up.name as assigned_user_name,
  up.avatar as assigned_user_avatar,
  COALESCE(up.role, 'tester') as assigned_user_role,
  ab.name as assigned_by_name,
  utp.completed,
  utp.completed_at,
  utp.notes
FROM qa_tests t
LEFT JOIN user_profiles up ON t.assigned_to = up.id
LEFT JOIN user_profiles ab ON t.assigned_by = ab.id
LEFT JOIN qa_user_test_progress utp ON t.id = utp.test_id AND t.assigned_to = utp.user_id;

-- ========================================
-- PART 5: ADD COMMENTS AND DOCUMENTATION
-- ========================================

-- Step 17: Add comments for documentation
COMMENT ON COLUMN user_profiles.role IS 'User role: admin or tester';
COMMENT ON COLUMN qa_tests.assigned_to IS 'User ID of the tester assigned to this test';
COMMENT ON COLUMN qa_tests.assigned_at IS 'Timestamp when the test was assigned';
COMMENT ON COLUMN qa_tests.assigned_by IS 'User ID who assigned the test';
COMMENT ON FUNCTION assign_test_to_user(TEXT, UUID, UUID) IS 'Assign a test to a user (only if unassigned)';
COMMENT ON FUNCTION unassign_test(TEXT, UUID) IS 'Unassign a test (only by assigned user)';
COMMENT ON FUNCTION can_modify_test_progress(TEXT, UUID) IS 'Check if user can modify test progress';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Get the role of a specific user';
COMMENT ON FUNCTION is_admin(UUID) IS 'Check if a user has admin role';
COMMENT ON VIEW test_assignments IS 'View showing test assignments with user information'; 