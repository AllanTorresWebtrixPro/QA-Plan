-- Fix RLS policies for qa_user_test_progress
-- This script fixes the issue where users can't insert progress records for tests they're assigned to

-- Drop ALL existing policies for qa_user_test_progress to avoid conflicts
DROP POLICY IF EXISTS "Only assigned users can modify their own progress" ON qa_user_test_progress;
DROP POLICY IF EXISTS "Users can view all test progress" ON qa_user_test_progress;
DROP POLICY IF EXISTS "Users can insert progress for assigned tests" ON qa_user_test_progress;
DROP POLICY IF EXISTS "Users can update their own progress for assigned tests" ON qa_user_test_progress;
DROP POLICY IF EXISTS "Users can delete their own progress for assigned tests" ON qa_user_test_progress;

-- Create separate policies for different operations

-- Policy for SELECT: Users can view all test progress (for collaboration)
CREATE POLICY "Users can view all test progress" ON qa_user_test_progress
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for INSERT: Users can insert progress for tests they're assigned to
CREATE POLICY "Users can insert progress for assigned tests" ON qa_user_test_progress
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  user_id = auth.uid() AND
  can_modify_test_progress(test_id, auth.uid())
);

-- Policy for UPDATE: Users can update their own progress for tests they're assigned to
CREATE POLICY "Users can update their own progress for assigned tests" ON qa_user_test_progress
FOR UPDATE USING (
  auth.role() = 'authenticated' AND 
  user_id = auth.uid() AND
  can_modify_test_progress(test_id, auth.uid())
);

-- Policy for DELETE: Users can delete their own progress for tests they're assigned to
CREATE POLICY "Users can delete their own progress for assigned tests" ON qa_user_test_progress
FOR DELETE USING (
  auth.role() = 'authenticated' AND 
  user_id = auth.uid() AND
  can_modify_test_progress(test_id, auth.uid())
);

-- Add a comment explaining the policies
COMMENT ON TABLE qa_user_test_progress IS 'Test progress records. Users can view all progress but only modify their own for tests they are assigned to.'; 