-- Migration script to move from qa_users to Supabase auth.users
-- Run this script after setting up Supabase auth

-- Step 1: Create user profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Convert user_id column from TEXT to UUID
-- First, drop the existing foreign key constraint
ALTER TABLE qa_user_test_progress 
DROP CONSTRAINT IF EXISTS qa_user_test_progress_user_id_fkey;

-- Convert the user_id column from TEXT to UUID
-- Note: This will only work if the existing user_id values are valid UUIDs
ALTER TABLE qa_user_test_progress 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Step 3: Add new foreign key constraint to auth.users
ALTER TABLE qa_user_test_progress 
ADD CONSTRAINT qa_user_test_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Enable Row Level Security
ALTER TABLE qa_user_test_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies

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

-- Step 6: Create function to automatically create user profile
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

-- Step 7: Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_name ON user_profiles(name);
CREATE INDEX IF NOT EXISTS idx_qa_user_test_progress_user_id ON qa_user_test_progress(user_id);

-- Step 9: Create function to update updated_at timestamp for user_profiles
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 10: Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_profiles_updated_at(); 