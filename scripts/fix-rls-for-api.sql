-- Fix RLS policies to allow API route operations
-- The current policy is too restrictive for server-side API calls

-- First, let's see what policies currently exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'qa_user_test_progress';

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Only assigned users can modify their own progress" ON qa_user_test_progress;
DROP POLICY IF EXISTS "Users can only modify their own progress" ON qa_user_test_progress;

-- Create a more permissive policy that allows API operations
-- This policy allows authenticated users to insert/update their own progress
-- and also allows the API route to work by checking if the user_id is valid
CREATE POLICY "Allow API and user operations" ON qa_user_test_progress
FOR ALL USING (
  auth.role() = 'authenticated' AND 
  (
    -- Allow if user is modifying their own progress
    (auth.uid() = user_id) OR
    -- Allow if the user_id exists in user_profiles (for API operations)
    (EXISTS (SELECT 1 FROM user_profiles WHERE id = user_id))
  )
);

-- Keep the view policy as is
-- CREATE POLICY "Users can view all test progress" ON qa_user_test_progress
-- FOR SELECT USING (auth.role() = 'authenticated');

-- Verify the new policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'qa_user_test_progress'; 