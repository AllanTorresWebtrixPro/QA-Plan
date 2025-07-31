-- Add test cases for remaining categories to ensure we have comprehensive coverage

-- Prospects Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'pro-002',
    'Prospect Search and Filtering',
    'Prospects',
    'Medium',
    '["Navigate to prospects page", "Use search functionality", "Apply filters", "Test sorting options", "Verify results accuracy"]',
    'Search and filtering work correctly with accurate results',
    '["Test with no results", "special characters", "very long search terms"]'
  ),
  (
    'pro-003',
    'Prospect Status Management',
    'Prospects',
    'Medium',
    '["Update prospect status", "Verify status changes", "Test status workflow", "Check notifications"]',
    'Status updates work correctly with proper workflow',
    '["Test invalid status transitions", "concurrent updates"]'
  );

-- Clients Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'cli-004',
    'Client Search and Filtering',
    'Clients',
    'Medium',
    '["Navigate to clients page", "Use search functionality", "Apply filters", "Test sorting", "Verify results"]',
    'Search and filtering return accurate client results',
    '["Test with no results", "special characters", "duplicate names"]'
  ),
  (
    'cli-005',
    'Client Communication History',
    'Clients',
    'Low',
    '["View client communication history", "Add new communication", "Edit existing entries", "Verify chronological order"]',
    'Communication history displays correctly with proper ordering',
    '["Test with no history", "many entries", "concurrent additions"]'
  );

-- Agents Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'agt-003',
    'Agent Commission Management',
    'Agents',
    'Medium',
    '["View agent commissions", "Calculate commission rates", "Process commission payments", "Generate commission reports"]',
    'Commission management works correctly with accurate calculations',
    '["Test with zero commissions", "complex rate structures", "payment failures"]'
  ),
  (
    'agt-004',
    'Agent Performance Tracking',
    'Agents',
    'Low',
    '["View agent performance metrics", "Generate performance reports", "Compare agent statistics", "Track goals and targets"]',
    'Performance tracking displays accurate metrics and comparisons',
    '["Test with new agents", "agents with no activity", "historical data"]'
  );

-- Payments Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'pay-004',
    'Payment Reconciliation',
    'Payments',
    'High',
    '["Match payments to invoices", "Resolve payment discrepancies", "Process refunds", "Update payment status"]',
    'Payment reconciliation works correctly with proper status updates',
    '["Test with partial payments", "overpayments", "failed transactions"]'
  ),
  (
    'pay-005',
    'Payment Reporting',
    'Payments',
    'Medium',
    '["Generate payment reports", "Filter by date range", "Export payment data", "Verify report accuracy"]',
    'Payment reports generate correctly with accurate data',
    '["Test with large datasets", "empty date ranges", "export failures"]'
  );

-- Navigation Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'nav-003',
    'Mobile Navigation',
    'Navigation',
    'Medium',
    '["Test navigation on mobile devices", "Verify hamburger menu", "Test touch interactions", "Check responsive behavior"]',
    'Mobile navigation works correctly with proper responsive behavior',
    '["Test on different screen sizes", "orientations", "touch gestures"]'
  ),
  (
    'nav-004',
    'Navigation Permissions',
    'Navigation',
    'High',
    '["Test navigation with different user roles", "Verify menu item visibility", "Test unauthorized access", "Check permission enforcement"]',
    'Navigation respects user permissions and role-based access',
    '["Test with expired sessions", "role changes", "permission conflicts"]'
  );

-- Formatting Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'fmt-003',
    'Number Formatting',
    'Formatting',
    'Medium',
    '["Check number formatting across application", "Verify decimal places", "Test large numbers", "Check negative numbers"]',
    'Numbers display consistently with proper formatting',
    '["Test with zero values", "very large numbers", "scientific notation"]'
  ),
  (
    'fmt-004',
    'Text Formatting and Truncation',
    'Formatting',
    'Low',
    '["Test long text handling", "Verify text truncation", "Check tooltip display", "Test special characters"]',
    'Text formatting handles long content appropriately',
    '["Test with empty text", "very long strings", "unicode characters"]'
  );

-- Security Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'sec-003',
    'Session Management',
    'Security',
    'High',
    '["Test session timeout", "Verify session renewal", "Test concurrent sessions", "Check session security"]',
    'Session management works correctly with proper security measures',
    '["Test with expired sessions", "session hijacking attempts", "concurrent logins"]'
  ),
  (
    'sec-004',
    'Data Encryption',
    'Security',
    'High',
    '["Verify sensitive data encryption", "Test data transmission security", "Check stored data protection", "Validate encryption standards"]',
    'Sensitive data is properly encrypted in transit and at rest',
    '["Test with different data types", "encryption key rotation", "decryption failures"]'
  );

-- Performance Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'perf-003',
    'Database Query Performance',
    'Performance',
    'Medium',
    '["Monitor database query execution times", "Test with large datasets", "Verify query optimization", "Check index usage"]',
    'Database queries execute within acceptable time limits',
    '["Test with maximum data loads", "complex queries", "concurrent access"]'
  ),
  (
    'perf-004',
    'Memory Usage Optimization',
    'Performance',
    'Low',
    '["Monitor memory usage", "Test memory leaks", "Verify garbage collection", "Check resource cleanup"]',
    'Application manages memory efficiently without leaks',
    '["Test with long-running sessions", "memory-intensive operations"]'
  );

-- Accessibility Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'acc-003',
    'Color Contrast and Visual Accessibility',
    'Accessibility',
    'Medium',
    '["Test color contrast ratios", "Verify text readability", "Test with color blindness simulation", "Check visual indicators"]',
    'Application meets color contrast and visual accessibility standards',
    '["Test with different color blindness types", "high contrast modes"]'
  ),
  (
    'acc-004',
    'Form Accessibility',
    'Accessibility',
    'Medium',
    '["Test form labels and descriptions", "Verify error message accessibility", "Test form navigation", "Check validation feedback"]',
    'Forms are fully accessible with proper labels and feedback',
    '["Test with complex forms", "dynamic form elements", "validation errors"]'
  );

-- Mobile Tests
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'mob-003',
    'Mobile Performance',
    'Mobile',
    'Medium',
    '["Test app performance on mobile", "Measure load times", "Test with slow connections", "Verify offline functionality"]',
    'Application performs well on mobile devices with various connection speeds',
    '["Test with very slow connections", "intermittent connectivity", "offline scenarios"]'
  ),
  (
    'mob-004',
    'Mobile Input and Gestures',
    'Mobile',
    'Medium',
    '["Test touch inputs", "Verify gesture recognition", "Test virtual keyboard", "Check input validation"]',
    'Mobile inputs and gestures work correctly across different devices',
    '["Test with different keyboard types", "gesture conflicts", "input method editors"]'
  );

ON CONFLICT (id) DO NOTHING;

-- Verify all categories now have test cases
SELECT 'Test Coverage by Category:' as section;
SELECT 
  category,
  count(*) as test_count,
  count(CASE WHEN priority = 'High' THEN 1 END) as high_priority,
  count(CASE WHEN priority = 'Medium' THEN 1 END) as medium_priority,
  count(CASE WHEN priority = 'Low' THEN 1 END) as low_priority
FROM qa_tests 
GROUP BY category
ORDER BY category;

SELECT 'Total Tests: ' || count(*) as total_tests FROM qa_tests;
