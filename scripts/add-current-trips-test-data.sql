-- Add sample test data for current trips testing

-- Sample current trips test data requirements
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'ct-data-001',
    'Current Trips Sample Data Setup',
    'Test Data',
    'High',
    '["Create sample current trips with various statuses", "Add sample lodge associations", "Create sample client data", "Set up trip dates and details"]',
    'Complete test data set available for current trips testing',
    '["Test with trips having no lodges", "trips with many lodges", "overlapping trip dates"]'
  ),
  (
    'ct-data-002',
    'Current Trips Survey Test Data',
    'Test Data',
    'Medium',
    '["Create survey assignments for trips", "Set up various survey statuses", "Add survey completion data", "Create survey badge test scenarios"]',
    'Survey test data available with various completion states',
    '["Test with missing survey assignments", "incomplete survey data", "survey status conflicts"]'
  ),
  (
    'ct-data-003',
    'Current Trips Integration Test Data',
    'Test Data',
    'Medium',
    '["Set up pre-trip associations", "Create invoice test scenarios", "Add client profile test data", "Create notification test cases"]',
    'Integration test data available for all current trips connections',
    '["Test with missing integration data", "data consistency issues", "orphaned records"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify all current trips related tests
SELECT 'Current Trips Test Data Summary:' as section;
SELECT 
  category,
  count(*) as test_count,
  count(CASE WHEN priority = 'High' THEN 1 END) as high_priority,
  count(CASE WHEN priority = 'Medium' THEN 1 END) as medium_priority,
  count(CASE WHEN priority = 'Low' THEN 1 END) as low_priority
FROM qa_tests 
WHERE category IN ('Current Trips', 'Test Data')
GROUP BY category
ORDER BY category;

SELECT 'Total Current Trips Tests: ' || count(*) as total_current_trips_tests 
FROM qa_tests 
WHERE category = 'Current Trips';
