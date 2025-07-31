-- Add sample test data for surveys testing

-- Sample survey test data requirements
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'srv-data-001',
    'Sample Survey Data Setup',
    'Test Data',
    'High',
    '["Create sample surveys with various question types", "Add sample survey sections", "Create sample submissions", "Verify test data integrity"]',
    'Complete test data set available for survey testing',
    '["Test with empty surveys", "surveys with maximum questions", "complex matrix questions"]'
  ),
  (
    'srv-data-002',
    'Survey Question Types Validation',
    'Test Data',
    'Medium',
    '["Create text input questions", "Create textarea questions", "Create number/email/phone questions", "Create select/radio/checkbox questions", "Create rating questions", "Create matrix questions"]',
    'All question types created and validated successfully',
    '["Test with special characters", "maximum length inputs", "invalid data types"]'
  ),
  (
    'srv-data-003',
    'Survey Submission Test Data',
    'Test Data',
    'Medium',
    '["Create complete survey submissions", "Create partial submissions", "Create draft submissions", "Verify submission data integrity"]',
    'Various submission states available for testing',
    '["Test with corrupted data", "missing required fields", "duplicate submissions"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify all survey-related tests
SELECT 'Survey Test Data Summary:' as section;
SELECT 
  category,
  count(*) as test_count,
  count(CASE WHEN priority = 'High' THEN 1 END) as high_priority,
  count(CASE WHEN priority = 'Medium' THEN 1 END) as medium_priority,
  count(CASE WHEN priority = 'Low' THEN 1 END) as low_priority
FROM qa_tests 
WHERE category IN ('Surveys', 'Test Data')
GROUP BY category
ORDER BY category;

SELECT 'Total Survey Tests: ' || count(*) as total_survey_tests 
FROM qa_tests 
WHERE category = 'Surveys';
