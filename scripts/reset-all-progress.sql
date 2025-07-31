-- Reset all user progress (use with caution!)
-- This will clear all completed tests and notes for all users

DELETE FROM qa_user_test_progress;

SELECT 'All user progress has been reset!' as status;
SELECT 'Remaining progress records: ' || count(*) as remaining_count FROM qa_user_test_progress;
