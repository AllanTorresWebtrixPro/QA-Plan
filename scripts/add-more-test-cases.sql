-- Add more comprehensive test cases for the MTP application

INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  -- Navigation Tests
  (
    'nav-001',
    'Main Menu Navigation',
    'Navigation',
    'High',
    '["Login as each user role", "Click each menu item", "Verify correct page loads", "Check breadcrumbs update"]',
    'All menu items work, correct pages load, breadcrumbs accurate',
    '["Test with slow network", "interrupted navigation"]'
  ),
  (
    'nav-002',
    'Breadcrumb Navigation',
    'Navigation',
    'Medium',
    '["Navigate through nested pages", "Click breadcrumb links", "Verify correct page loads"]',
    'Breadcrumbs show current location, clicking them navigates correctly',
    '["Test with deep navigation paths", "special characters in page names"]'
  ),
  
  -- Invoice Tests
  (
    'inv-003',
    'Invoice Search & Filtering',
    'Invoices',
    'High',
    '["Enter search terms in search box", "Apply date filters", "Apply status filters", "Clear filters"]',
    'Search returns relevant results, filters work correctly, clear button resets',
    '["Test with empty search", "special characters", "very long search terms"]'
  ),
  (
    'inv-004',
    'Invoice Payment Processing',
    'Invoices',
    'High',
    '["Open unpaid invoice", "Click Record Payment", "Enter payment details", "Submit payment"]',
    'Payment recorded, invoice status updated, payment history updated',
    '["Test partial payments", "overpayments", "payment date in future/past"]'
  ),
  (
    'inv-005',
    'Invoice Email Functionality',
    'Invoices',
    'Medium',
    '["Open invoice", "Click Email Invoice", "Verify email content", "Send email"]',
    'Email sent successfully, confirmation message shown',
    '["Test with invalid email addresses", "email delivery failures"]'
  ),
  
  -- Client Tests
  (
    'cli-002',
    'Client Invoice History',
    'Clients',
    'Medium',
    '["View client profile", "Navigate to invoice history", "Verify all invoices listed"]',
    'All client invoices displayed with correct data',
    '["Test with clients having no invoices", "many invoices"]'
  ),
  (
    'cli-003',
    'Client Pretrip Management',
    'Clients',
    'Medium',
    '["View client pretrips", "Create new pretrip", "Edit existing pretrip"]',
    'Pretrips managed correctly, data saved properly',
    '["Test with conflicting pretrip dates", "incomplete pretrip data"]'
  ),
  
  -- Agent Tests
  (
    'agt-001',
    'Agent Profile Management',
    'Agents',
    'Medium',
    '["Create new agent", "Assign company", "Set permissions", "Save profile"]',
    'Agent profile created with correct permissions',
    '["Test with duplicate agent codes", "invalid company assignments"]'
  ),
  (
    'agt-002',
    'Agent Status Management',
    'Agents',
    'Medium',
    '["Toggle agent active/inactive status", "Verify status changes", "Check access restrictions"]',
    'Status changes correctly, inactive agents have restricted access',
    '["Test with agents having active invoices", "pending tasks"]'
  ),
  
  -- Payment Tests
  (
    'pay-002',
    'Payment History',
    'Payments',
    'Medium',
    '["View payment history", "Filter by date range", "Search payments"]',
    'Payment history displays correctly, filters work',
    '["Test with no payments", "many payments", "failed payments"]'
  ),
  (
    'pay-003',
    'Payment Gateway Integration',
    'Payments',
    'High',
    '["Initiate payment through gateway", "Complete payment process", "Verify payment confirmation"]',
    'Payment processed successfully, confirmation received, invoice updated',
    '["Test payment failures", "network timeouts", "gateway errors"]'
  ),
  
  -- Formatting & Validation Tests
  (
    'fmt-001',
    'Date Display Consistency',
    'Formatting',
    'Medium',
    '["Check all date fields across application", "Verify Month Day, Year format", "Test different date inputs"]',
    'All dates display in consistent Month Day, Year format',
    '["Test with null dates", "invalid dates", "future dates"]'
  ),
  (
    'fmt-002',
    'Currency Display',
    'Formatting',
    'Medium',
    '["Check all currency fields", "Verify USD formatting", "Test decimal places"]',
    'All amounts display as USD with 2 decimal places',
    '["Test with zero amounts", "very large amounts", "negative amounts"]'
  ),
  
  -- Security Tests
  (
    'sec-001',
    'Page Access Permissions',
    'Security',
    'High',
    '["Try to access unauthorized pages", "Verify redirects", "Check error messages"]',
    'Unauthorized access blocked with appropriate messages',
    '["Test with URL manipulation", "expired sessions"]'
  ),
  (
    'sec-002',
    'Data Access Permissions',
    'Security',
    'High',
    '["Login as different user roles", "Verify data visibility", "Test data modification permissions"]',
    'Users only see/modify data they are authorized for',
    '["Test with shared data", "inherited permissions"]'
  ),
  
  -- Performance Tests
  (
    'perf-001',
    'Page Load Performance',
    'Performance',
    'Medium',
    '["Measure page load times", "Test with different network speeds", "Verify optimization"]',
    'Pages load within acceptable time limits',
    '["Test with slow connections", "large data loads"]'
  ),
  (
    'perf-002',
    'Large Dataset Handling',
    'Performance',
    'Medium',
    '["Test with large datasets", "Verify performance", "Check pagination"]',
    'App handles large datasets without performance issues',
    '["Test with maximum data limits", "memory constraints"]'
  ),
  
  -- Accessibility Tests
  (
    'acc-001',
    'Keyboard Navigation',
    'Accessibility',
    'Medium',
    '["Navigate using only keyboard", "Test tab order", "Verify focus indicators"]',
    'All functionality accessible via keyboard',
    '["Test with complex forms", "dynamic content"]'
  ),
  (
    'acc-002',
    'Screen Reader Compatibility',
    'Accessibility',
    'Medium',
    '["Test with screen reader", "Verify ARIA labels", "Check content structure"]',
    'Screen reader can navigate and understand content',
    '["Test with complex tables", "dynamic updates"]'
  ),
  
  -- Mobile Responsiveness Tests
  (
    'mob-001',
    'Mobile Layout Testing',
    'Mobile',
    'High',
    '["Test on mobile devices", "Check responsive breakpoints", "Verify touch interactions"]',
    'App works well on mobile with appropriate layout',
    '["Test with different screen sizes", "orientations"]'
  ),
  (
    'mob-002',
    'Tablet Layout Testing',
    'Mobile',
    'Medium',
    '["Test on tablet devices", "Verify layout adaptation", "Check touch interactions"]',
    'App adapts appropriately for tablet screens',
    '["Test with different tablet sizes", "orientations"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the additional tests were added
SELECT 'Additional test cases added successfully!' as status;
SELECT 'Total tests now: ' || count(*) as total_test_count FROM qa_tests;
SELECT category, count(*) as test_count FROM qa_tests GROUP BY category ORDER BY category;
