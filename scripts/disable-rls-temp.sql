-- Temporarily disable RLS on qa_user_test_progress table
-- This allows all operations without restrictions for now

-- Disable RLS on the table
ALTER TABLE qa_user_test_progress DISABLE ROW LEVEL SECURITY;

-- Add a comment to remind us this is temporary
COMMENT ON TABLE qa_user_test_progress IS 'RLS temporarily disabled for development. Re-enable with proper policies later.'; 