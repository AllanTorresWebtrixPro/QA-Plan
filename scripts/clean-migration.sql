-- Clean migration script - starts fresh
-- This will clear existing data and set up the new auth-based structure

-- Step 1: Clear existing progress data (since user IDs don't match)
DELETE FROM qa_user_test_progress;

-- Step 2: Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Drop existing foreign key constraint
ALTER TABLE qa_user_test_progress 
DROP CONSTRAINT IF EXISTS qa_user_test_progress_user_id_fkey;

-- Step 4: Convert user_id column to UUID
ALTER TABLE qa_user_test_progress 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Step 5: Add new foreign key constraint to auth.users
ALTER TABLE qa_user_test_progress 
ADD CONSTRAINT qa_user_test_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 6: Enable Row Level Security
ALTER TABLE qa_user_test_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies

-- Policy: Users can view all test progress (for collaboration)
CREATE POLICY "Users can view all test progress" ON qa_user_test_progress
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Users can only insert/update their own progress
CREATE POLICY "Users can only modify their own progress" ON qa_user_test_progress
FOR ALL USING (auth.uid() = user_id);

-- Policy: Users can view all tests (public test definitions)
CREATE POLICY "Users can view all tests" ON qa_tests
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Users can view all user profiles
CREATE POLICY "Users can view all profiles" ON user_profiles
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Users can only update their own profile
CREATE POLICY "Users can only update their own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 8: Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 10: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_name ON user_profiles(name);
CREATE INDEX IF NOT EXISTS idx_qa_user_test_progress_user_id ON qa_user_test_progress(user_id);

-- Step 11: Create function to update updated_at timestamp for user_profiles
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 12: Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_profiles_updated_at(); 