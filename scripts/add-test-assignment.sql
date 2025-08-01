-- Add test assignment functionality
-- This adds assignment tracking to qa_tests table

-- Step 1: Add assignment fields to qa_tests table
ALTER TABLE qa_tests 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Step 2: Create indexes for assignment queries
CREATE INDEX IF NOT EXISTS idx_qa_tests_assigned_to ON qa_tests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_qa_tests_assigned_at ON qa_tests(assigned_at);
CREATE INDEX IF NOT EXISTS idx_qa_tests_unassigned ON qa_tests(assigned_to) WHERE assigned_to IS NULL;

-- Step 3: Create a function to assign a test to a user
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

-- Step 4: Create a function to unassign a test
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

-- Step 5: Create a function to check if user can modify test progress
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

-- Step 6: Update RLS policies for qa_tests to include assignment logic

-- Policy: Users can view all tests
DROP POLICY IF EXISTS "Users can view all tests" ON qa_tests;
CREATE POLICY "Users can view all tests" ON qa_tests
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only assigned users can update test assignment
CREATE POLICY "Only assigned users can update test assignment" ON qa_tests
FOR UPDATE USING (
  auth.role() = 'authenticated' AND 
  (assigned_to = auth.uid() OR assigned_to IS NULL)
);

-- Step 7: Update RLS policies for qa_user_test_progress

-- Policy: Users can view all test progress (for collaboration)
DROP POLICY IF EXISTS "Users can view all test progress" ON qa_user_test_progress;
CREATE POLICY "Users can view all test progress" ON qa_user_test_progress
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only assigned users can modify their own progress
DROP POLICY IF EXISTS "Users can only modify their own progress" ON qa_user_test_progress;
CREATE POLICY "Only assigned users can modify their own progress" ON qa_user_test_progress
FOR ALL USING (
  auth.role() = 'authenticated' AND 
  user_id = auth.uid() AND
  can_modify_test_progress(test_id, auth.uid())
);

-- Step 8: Create a view for test assignments with user info
CREATE OR REPLACE VIEW test_assignments AS
SELECT 
  t.id as test_id,
  t.title,
  t.category,
  t.priority,
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

-- Step 9: Add comments for documentation
COMMENT ON COLUMN qa_tests.assigned_to IS 'User ID of the tester assigned to this test';
COMMENT ON COLUMN qa_tests.assigned_at IS 'Timestamp when the test was assigned';
COMMENT ON COLUMN qa_tests.assigned_by IS 'User ID who assigned the test';
COMMENT ON FUNCTION assign_test_to_user(TEXT, UUID, UUID) IS 'Assign a test to a user (only if unassigned)';
COMMENT ON FUNCTION unassign_test(TEXT, UUID) IS 'Unassign a test (only by assigned user)';
COMMENT ON FUNCTION can_modify_test_progress(TEXT, UUID) IS 'Check if user can modify test progress';
COMMENT ON VIEW test_assignments IS 'View showing test assignments with user information'; 