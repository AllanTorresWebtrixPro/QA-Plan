-- Add sample test data for on-site invoice testing

-- Sample on-site invoice test data requirements
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'osi-data-001',
    'On-Site Invoice Sample Data Setup',
    'Test Data',
    'High',
    '["Create sample on-site invoices with various statuses", "Add sample invoice items", "Create sample payment records", "Set up client data for invoices"]',
    'Complete test data set available for on-site invoice testing',
    '["Test with zero amount invoices", "invoices with many items", "complex payment scenarios"]'
  ),
  (
    'osi-data-002',
    'On-Site Invoice Payment Test Data',
    'Test Data',
    'High',
    '["Create test payment gateway scenarios", "Set up QR code test data", "Create payment link test cases", "Add failed payment scenarios"]',
    'Payment testing scenarios available with various outcomes',
    '["Test with expired payment methods", "gateway timeout scenarios", "partial payment data"]'
  ),
  (
    'osi-data-003',
    'On-Site Invoice Status Test Data',
    'Test Data',
    'Medium',
    '["Create invoices in all possible statuses", "Set up status transition scenarios", "Add workflow test data", "Create audit trail data"]',
    'All invoice statuses and transitions available for testing',
    '["Test with invalid status combinations", "concurrent status changes", "orphaned status records"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify all on-site invoice related tests
SELECT 'On-Site Invoice Test Data Summary:' as section;
SELECT 
  category,
  count(*) as test_count,
  count(CASE WHEN priority = 'High' THEN 1 END) as high_priority,
  count(CASE WHEN priority = 'Medium' THEN 1 END) as medium_priority,
  count(CASE WHEN priority = 'Low' THEN 1 END) as low_priority
FROM qa_tests 
WHERE category IN ('On-Site Invoices', 'Test Data')
GROUP BY category
ORDER BY category;

SELECT 'Total On-Site Invoice Tests: ' || count(*) as total_onsite_invoice_tests 
FROM qa_tests 
WHERE category = 'On-Site Invoices';
