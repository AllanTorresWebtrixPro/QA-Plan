-- Verify Database Storage and User Progress
-- This script checks if data is properly stored in the database

-- Check if tables exist and have data
SELECT 'Database Tables Status:' as section;

SELECT 
  'qa_users' as table_name,
  count(*) as record_count,
  'Users in system' as description
FROM qa_users
UNION ALL
SELECT 
  'qa_tests' as table_name,
  count(*) as record_count,
  'Test cases available' as description
FROM qa_tests
UNION ALL
SELECT 
  'qa_user_test_progress' as table_name,
  count(*) as record_count,
  'User progress records' as description
FROM qa_user_test_progress;

-- Show all users
SELECT 'All Users:' as section;
SELECT id, name, email, avatar, created_at FROM qa_users ORDER BY name;

-- Show test categories and counts
SELECT 'Test Categories:' as section;
SELECT category, count(*) as test_count FROM qa_tests GROUP BY category ORDER BY category;

-- Show user progress summary
SELECT 'User Progress Summary:' as section;
SELECT 
  u.name as user_name,
  COUNT(p.id) as tests_attempted,
  COUNT(CASE WHEN p.completed = true THEN 1 END) as tests_completed,
  ROUND(
    (COUNT(CASE WHEN p.completed = true THEN 1 END) * 100.0 / NULLIF(COUNT(p.id), 0)), 2
  ) as completion_percentage
FROM qa_users u
LEFT JOIN qa_user_test_progress p ON u.id = p.user_id
GROUP BY u.id, u.name
ORDER BY u.name;

-- Show detailed progress for each user
SELECT 'Detailed User Progress:' as section;
SELECT 
  u.name as user_name,
  t.category,
  t.title as test_name,
  CASE WHEN p.completed THEN 'COMPLETED' ELSE 'PENDING' END as status,
  p.completed_at,
  CASE WHEN p.notes IS NOT NULL AND p.notes != '' THEN 'Has Notes' ELSE 'No Notes' END as notes_status
FROM qa_users u
CROSS JOIN qa_tests t
LEFT JOIN qa_user_test_progress p ON u.id = p.user_id AND t.id = p.test_id
ORDER BY u.name, t.category, t.title;

-- Show recent activity
SELECT 'Recent Activity (Last 10 Records):' as section;
SELECT 
  u.name as user_name,
  t.title as test_name,
  CASE WHEN p.completed THEN 'COMPLETED' ELSE 'STARTED' END as action,
  p.updated_at as timestamp
FROM qa_user_test_progress p
JOIN qa_users u ON p.user_id = u.id
JOIN qa_tests t ON p.test_id = t.id
ORDER BY p.updated_at DESC
LIMIT 10;
