-- Add Payments Testing Guide Test Cases to Database
-- This script adds comprehensive testing scenarios for the Payments management section

-- Insert Payments Testing Guide test cases
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES

-- Payment Dashboard & Metrics Tests
(
  'pay-004',
  'Payment Dashboard Metrics Display',
  'Payments',
  'High',
  '["Navigate to Payments section", "View dashboard metrics cards", "Check Total Payments count", "Verify Pending Payments count", "Check Completed Payments count", "Verify Failed Payments count", "Check Total Amount Processed"]',
  'All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors',
  '["Test with zero payments", "test with very large amounts", "test with decimal calculations", "test with data updates"]'
),

(
  'pay-005',
  'Payment Dashboard Navigation',
  'Payments',
  'High',
  '["Click on Payments tab", "Click on other tabs (Agents, Companies)", "Verify tab switching works", "Check content updates correctly", "Test browser back/forward navigation"]',
  'Tab switching works smoothly, content updates correctly, navigation state maintained, no data loss during navigation',
  '["Test with unsaved form data", "test with active filters", "test with selected table rows", "test with browser refresh"]'
),

-- Payment Table Display Tests
(
  'pay-006',
  'Payment Table Initial Load',
  'Payments',
  'High',
  '["Load Payments section", "Wait for table to populate", "Verify all columns are visible", "Check table headers are correct", "Verify data rows are displayed"]',
  'Table loads within 3 seconds, all columns visible, headers correct, data rows displayed, no loading errors',
  '["Test with slow network connection", "test with large datasets", "test with empty data", "test with browser cache disabled"]'
),

(
  'pay-007',
  'Payment Table Column Sorting',
  'Payments',
  'Medium',
  '["Click on Payment ID column header", "Click on Amount column header", "Click on Date column header", "Click on Status column header", "Verify sort direction toggles"]',
  'Clicking headers sorts data correctly, sort direction toggles (asc/desc), sort indicators visible, sort persists during navigation',
  '["Test with null values", "test with mixed data types", "test with special characters", "test with very long text"]'
),

(
  'pay-008',
  'Payment Table Pagination',
  'Payments',
  'Medium',
  '["Navigate through different pages", "Change items per page", "Test page size options", "Verify data consistency across pages", "Check page numbers update"]',
  'Page navigation works correctly, page size changes work, data remains consistent, page numbers are accurate',
  '["Test with very large datasets", "test with page size changes", "test with concurrent data updates", "test with network delays"]'
),

-- Payment Search & Filter Tests
(
  'pay-009',
  'Payment Search Functionality',
  'Payments',
  'High',
  '["Enter search terms in search box", "Test payment ID searches", "Test amount searches", "Test customer name searches", "Verify search results accuracy"]',
  'Search results appear instantly, results match search criteria, no false positives, search highlights matching text',
  '["Test with no results", "test with special characters", "test with very long search terms", "test with SQL injection attempts"]'
),

(
  'pay-010',
  'Payment Filter by Status',
  'Payments',
  'Medium',
  '["Filter by Pending payments", "Filter by Completed payments", "Filter by Failed payments", "Filter by Cancelled payments", "Test multiple status selections"]',
  'Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate',
  '["Test with no payments in status", "test with all statuses selected", "test with status changes during filtering"]'
),

(
  'pay-011',
  'Payment Filter by Date Range',
  'Payments',
  'Medium',
  '["Select start date", "Select end date", "Test date range validation", "Verify filtered results", "Test clear filter option"]',
  'Date range filters work correctly, validation prevents invalid ranges, filtered results accurate, clear option works',
  '["Test with future dates", "test with very old dates", "test with invalid date ranges", "test with timezone differences"]'
),

(
  'pay-012',
  'Payment Filter by Amount Range',
  'Payments',
  'Medium',
  '["Enter minimum amount", "Enter maximum amount", "Test amount validation", "Verify filtered results", "Test clear filter option"]',
  'Amount range filters work correctly, validation prevents invalid amounts, filtered results accurate, clear option works',
  '["Test with negative amounts", "test with very large amounts", "test with decimal precision", "test with currency symbols"]'
),

-- Payment CRUD Operations Tests
(
  'pay-013',
  'Add New Payment - Form Display',
  'Payments',
  'High',
  '["Click Add New Payment button", "Verify modal opens correctly", "Check all required fields are marked", "Verify form layout is correct", "Test form responsiveness"]',
  'Modal opens smoothly, all required fields marked with asterisks, form layout is clean, responsive design works',
  '["Test with different screen sizes", "test with browser zoom levels", "test with different font sizes", "test with high DPI displays"]'
),

(
  'pay-014',
  'Add New Payment - Required Field Validation',
  'Payments',
  'High',
  '["Leave Amount empty", "Leave Customer empty", "Leave Payment Method empty", "Submit form", "Verify validation errors"]',
  'Required field validation works, error messages clear, form highlights problematic fields, user can correct errors easily',
  '["Test with all required fields missing", "test with partial required fields", "test with whitespace only", "test with very long text"]'
),

(
  'pay-015',
  'Add New Payment - Field Format Validation',
  'Payments',
  'High',
  '["Enter invalid amount format", "Enter invalid email format", "Enter invalid phone format", "Submit form", "Verify format validation"]',
  'Format validation works correctly, error messages helpful, form prevents submission with invalid data, user guidance clear',
  '["Test with various invalid formats", "test with edge case data", "test with international formats", "test with special characters"]'
),

(
  'pay-016',
  'Add New Payment - Successful Submission',
  'Payments',
  'High',
  '["Fill all required fields correctly", "Fill optional fields", "Select payment method", "Submit form", "Verify payment appears in table"]',
  'Form submits successfully, new payment appears in table, success message displayed, modal closes automatically',
  '["Test with maximum field lengths", "test with special characters", "test with large amounts", "test with concurrent submissions"]'
),

(
  'pay-017',
  'Edit Payment - Form Population',
  'Payments',
  'High',
  '["Click Edit button on existing payment", "Verify modal opens with current data", "Check all fields populated correctly", "Verify amount displays correctly", "Test field editing"]',
  'Edit form opens with current payment data, all fields populated correctly, amount displays properly, form is editable',
  '["Test with payments having all fields filled", "test with payments missing optional fields", "test with payments having special characters"]'
),

(
  'pay-018',
  'Edit Payment - Data Updates',
  'Payments',
  'High',
  '["Modify payment amount", "Change customer information", "Update payment method", "Change payment status", "Save changes", "Verify updates reflected"]',
  'Changes saved successfully, updated information displays correctly in table, no data corruption occurs, success message shown',
  '["Test with concurrent edits", "test with invalid data", "test with network interruption", "test with large amount updates"]'
),

(
  'pay-019',
  'Delete Payment - Confirmation Dialog',
  'Payments',
  'High',
  '["Click Delete button on payment", "Verify confirmation dialog appears", "Check dialog text is clear", "Test dialog close button", "Verify dialog positioning"]',
  'Confirmation dialog appears correctly, text is clear and informative, close button works, dialog properly positioned',
  '["Test with different screen sizes", "test with long payment IDs", "test with special characters in IDs", "test with browser zoom"]'
),

(
  'pay-020',
  'Delete Payment - Successful Deletion',
  'Payments',
  'High',
  '["Confirm payment deletion", "Verify payment removed from table", "Check metrics update correctly", "Verify no errors occur", "Test table refresh"]',
  'Payment permanently deleted, table updates immediately, metrics recalculated, success message displayed, no errors',
  '["Test with payments having relationships", "test with payments having attachments", "test with network failure during deletion", "test with browser refresh during process"]'
),

-- Payment Method Tests
(
  'pay-021',
  'Credit Card Payment Method',
  'Payments',
  'High',
  '["Select Credit Card payment method", "Enter card number", "Enter expiry date", "Enter CVV", "Enter cardholder name", "Submit payment"]',
  'Credit card form displays correctly, validation works, payment processes successfully, confirmation message shown',
  '["Test with invalid card numbers", "test with expired cards", "test with invalid CVV", "test with special characters in names"]'
),

(
  'pay-022',
  'Bank Transfer Payment Method',
  'Payments',
  'High',
  '["Select Bank Transfer payment method", "Enter account number", "Enter routing number", "Enter account holder name", "Submit payment"]',
  'Bank transfer form displays correctly, validation works, payment processes successfully, confirmation message shown',
  '["Test with invalid account numbers", "test with invalid routing numbers", "test with special characters in names", "test with very long account numbers"]'
),

(
  'pay-023',
  'Digital Wallet Payment Method',
  'Payments',
  'High',
  '["Select Digital Wallet payment method", "Choose wallet type (PayPal, Apple Pay, Google Pay)", "Enter wallet credentials", "Submit payment"]',
  'Digital wallet form displays correctly, wallet selection works, payment processes successfully, confirmation message shown',
  '["Test with invalid wallet credentials", "test with unsupported wallet types", "test with network failures", "test with wallet timeouts"]'
),

(
  'pay-024',
  'Cash Payment Method',
  'Payments',
  'High',
  '["Select Cash payment method", "Enter amount received", "Calculate change", "Confirm payment", "Generate receipt"]',
  'Cash payment form displays correctly, change calculation accurate, receipt generated, payment confirmed',
  '["Test with insufficient cash", "test with exact amounts", "test with very large amounts", "test with decimal amounts"]'
),

-- Payment Processing Tests
(
  'pay-025',
  'Payment Processing - Success',
  'Payments',
  'High',
  '["Submit valid payment", "Wait for processing", "Verify success status", "Check confirmation email", "Verify payment in table"]',
  'Payment processes successfully, status updates to completed, confirmation email sent, payment appears in completed list',
  '["Test with different payment methods", "test with various amounts", "test with different currencies", "test with network delays"]'
),

(
  'pay-026',
  'Payment Processing - Failure',
  'Payments',
  'High',
  '["Submit invalid payment", "Wait for processing", "Verify failure status", "Check error message", "Verify payment in failed list"]',
  'Payment fails appropriately, status updates to failed, clear error message displayed, payment appears in failed list',
  '["Test with expired cards", "test with insufficient funds", "test with invalid credentials", "test with network failures"]'
),

(
  'pay-027',
  'Payment Processing - Pending',
  'Payments',
  'Medium',
  '["Submit payment requiring approval", "Verify pending status", "Check approval workflow", "Approve payment", "Verify completion"]',
  'Payment shows pending status, approval workflow accessible, approval process works, status updates correctly',
  '["Test with different approval levels", "test with multiple approvers", "test with approval timeouts", "test with approval rejections"]'
),

-- Payment Refund Tests
(
  'pay-028',
  'Payment Refund - Full Refund',
  'Payments',
  'High',
  '["Select completed payment", "Click Refund button", "Select full refund option", "Enter refund reason", "Process refund"]',
  'Refund form displays correctly, full refund processes successfully, payment status updates, refund confirmation shown',
  '["Test with different payment methods", "test with various amounts", "test with different currencies", "test with network delays"]'
),

(
  'pay-029',
  'Payment Refund - Partial Refund',
  'Payments',
  'High',
  '["Select completed payment", "Click Refund button", "Select partial refund option", "Enter refund amount", "Enter refund reason", "Process refund"]',
  'Partial refund form displays correctly, amount validation works, refund processes successfully, status updates correctly',
  '["Test with amounts larger than original", "test with decimal amounts", "test with zero amounts", "test with negative amounts"]'
),

(
  'pay-030',
  'Payment Refund - Refund Status Tracking',
  'Payments',
  'Medium',
  '["Process refund", "Check refund status", "Monitor status updates", "Verify completion", "Check refund confirmation"]',
  'Refund status tracks correctly, updates display in real-time, completion confirmed, refund confirmation generated',
  '["Test with network delays", "test with system failures", "test with concurrent refunds", "test with large amounts"]'
),

-- Payment Reporting Tests
(
  'pay-031',
  'Payment Reports - Daily Summary',
  'Payments',
  'Medium',
  '["Navigate to Reports section", "Select Daily Summary report", "Choose date range", "Generate report", "Verify report accuracy"]',
  'Daily summary report generates correctly, data accurate, date range selection works, report displays properly',
  '["Test with no payments in range", "test with very large datasets", "test with different date formats", "test with timezone differences"]'
),

(
  'pay-032',
  'Payment Reports - Monthly Summary',
  'Payments',
  'Medium',
  '["Navigate to Reports section", "Select Monthly Summary report", "Choose month and year", "Generate report", "Verify report accuracy"]',
  'Monthly summary report generates correctly, data accurate, month/year selection works, report displays properly',
  '["Test with no payments in month", "test with leap years", "test with different fiscal years", "test with large amounts"]'
),

(
  'pay-033',
  'Payment Reports - Export Functionality',
  'Payments',
  'Medium',
  '["Generate payment report", "Click Export button", "Choose export format (PDF, CSV, Excel)", "Download file", "Verify file content"]',
  'Export functionality works correctly, all formats supported, file downloads successfully, content matches report',
  '["Test with large reports", "test with different browsers", "test with network interruptions", "test with different file formats"]'
),

-- Payment Security Tests
(
  'pay-034',
  'Payment Data Encryption',
  'Payments',
  'High',
  '["Submit payment with sensitive data", "Check network traffic", "Verify data encryption", "Check database storage", "Verify PCI compliance"]',
  'All sensitive payment data encrypted in transit and at rest, network traffic secure, database storage encrypted, PCI compliant',
  '["Test with different payment methods", "test with various data types", "test with network sniffing", "test with database access"]'
),

(
  'pay-035',
  'Payment Authentication',
  'Payments',
  'High',
  '["Attempt payment without authentication", "Verify access denied", "Login with valid credentials", "Attempt payment again", "Verify success"]',
  'Authentication required for payments, access denied without credentials, payment succeeds with valid authentication',
  '["Test with expired sessions", "test with invalid credentials", "test with multiple user accounts", "test with role-based access"]'
),

(
  'pay-036',
  'Payment Fraud Detection',
  'Payments',
  'High',
  '["Submit suspicious payment", "Verify fraud detection triggers", "Check payment review process", "Verify manual review option", "Test fraud prevention"]',
  'Fraud detection works correctly, suspicious payments flagged, review process accessible, prevention measures effective',
  '["Test with various fraud patterns", "test with false positives", "test with different payment methods", "test with international payments"]'
),

-- Payment Integration Tests
(
  'pay-037',
  'Payment Gateway Integration',
  'Payments',
  'High',
  '["Submit payment through gateway", "Verify gateway communication", "Check response handling", "Verify payment processing", "Test error handling"]',
  'Gateway integration works correctly, communication successful, responses handled properly, payments process successfully',
  '["Test with gateway failures", "test with network timeouts", "test with invalid responses", "test with concurrent requests"]'
),

(
  'pay-038',
  'Payment Webhook Integration',
  'Payments',
  'Medium',
  '["Process payment", "Verify webhook sent", "Check webhook payload", "Verify webhook delivery", "Test webhook retry"]',
  'Webhooks sent correctly, payload contains accurate data, delivery successful, retry mechanism works',
  '["Test with webhook failures", "test with invalid payloads", "test with delivery delays", "test with multiple webhooks"]'
),

(
  'pay-039',
  'Payment API Integration',
  'Payments',
  'Medium',
  '["Call payment API", "Verify API authentication", "Check request validation", "Verify response format", "Test error responses"]',
  'API integration works correctly, authentication successful, validation effective, responses formatted properly',
  '["Test with invalid API keys", "test with malformed requests", "test with rate limiting", "test with API versioning"]'
),

-- Payment Performance Tests
(
  'pay-040',
  'Payment Processing Performance',
  'Payments',
  'Medium',
  '["Submit multiple payments", "Monitor processing time", "Check system resources", "Verify response times", "Test concurrent payments"]',
  'Payment processing performs well, response times acceptable, system resources stable, concurrent processing works',
  '["Test with high volume", "test with large amounts", "test with complex payment methods", "test with network delays"]'
),

(
  'pay-041',
  'Payment Report Generation Performance',
  'Payments',
  'Medium',
  '["Generate large reports", "Monitor generation time", "Check memory usage", "Verify report accuracy", "Test export performance"]',
  'Report generation performs well, memory usage stable, reports accurate, export functionality efficient',
  '["Test with very large datasets", "test with complex reports", "test with multiple exports", "test with system load"]'
),

-- Payment Error Handling Tests
(
  'pay-042',
  'Payment Network Error Handling',
  'Payments',
  'High',
  '["Disconnect network connection", "Attempt payment submission", "Verify error handling", "Reconnect network", "Verify recovery"]',
  'Network errors handled gracefully, user informed of issues, retry options available, recovery successful',
  '["Test with intermittent connectivity", "test with slow network", "test with timeout scenarios", "test with server errors"]'
),

(
  'pay-043',
  'Payment Form Error Recovery',
  'Payments',
  'High',
  '["Submit form with errors", "Correct validation errors", "Resubmit form", "Verify successful submission", "Check error state cleared"]',
  'Form error recovery works correctly, validation errors clear after correction, successful submission possible, error state properly managed',
  '["Test with multiple validation errors", "test with complex error scenarios", "test with concurrent error corrections", "test with form refresh"]'
),

-- Payment Accessibility Tests
(
  'pay-044',
  'Payment Keyboard Navigation',
  'Payments',
  'High',
  '["Use Tab key to navigate form", "Use Enter/Space to activate buttons", "Use arrow keys in table", "Test escape key functionality", "Verify focus management"]',
  'All interactive elements reachable, focus indicators visible, keyboard shortcuts work, no keyboard traps, focus management proper',
  '["Test with screen reader", "test with keyboard-only navigation", "test with different keyboard layouts", "test with assistive technologies"]'
),

(
  'pay-045',
  'Payment Screen Reader Compatibility',
  'Payments',
  'High',
  '["Enable screen reader software", "Navigate through payment form", "Verify proper labeling", "Check semantic structure", "Test form accessibility"]',
  'Screen reader announces elements correctly, form labels properly associated, semantic structure clear, navigation logical',
  '["Test with different screen readers", "test with different languages", "test with complex forms", "test with dynamic content"]'
),

-- Payment Cross-Browser Tests
(
  'pay-046',
  'Payment Chrome Compatibility',
  'Payments',
  'Medium',
  '["Test all payment features in Chrome", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify payment processing"]',
  'All payment features work correctly, JavaScript executes properly, CSS renders as expected, payments process successfully',
  '["Test with different Chrome versions", "test with Chrome extensions", "test with Chrome DevTools", "test with Chrome flags"]'
),

(
  'pay-047',
  'Payment Firefox Compatibility',
  'Payments',
  'Medium',
  '["Test all payment features in Firefox", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify payment processing"]',
  'All payment features work correctly, JavaScript executes properly, CSS renders as expected, payments process successfully',
  '["Test with different Firefox versions", "test with Firefox add-ons", "test with Firefox Developer Tools", "test with Firefox preferences"]'
),

(
  'pay-048',
  'Payment Safari Compatibility',
  'Payments',
  'Medium',
  '["Test all payment features in Safari", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify payment processing"]',
  'All payment features work correctly, JavaScript executes properly, CSS renders as expected, payments process successfully',
  '["Test with different Safari versions", "test with Safari Developer Tools", "test with Safari preferences", "test with Safari extensions"]'
),

-- Payment Responsive Design Tests
(
  'pay-049',
  'Payment Desktop Layout (1920x1080)',
  'Payments',
  'Medium',
  '["Set browser to 1920x1080 resolution", "Verify all elements visible", "Check table displays full columns", "Test horizontal scrolling if needed", "Verify form layout"]',
  'All UI elements fit properly, table shows maximum information, no horizontal scrolling needed, form layout optimized',
  '["Test with different desktop resolutions", "test with browser zoom levels", "test with different font sizes", "test with high DPI displays"]'
),

(
  'pay-050',
  'Payment Tablet Layout (768x1024)',
  'Payments',
  'Medium',
  '["Set browser to 768x1024 resolution", "Check responsive breakpoints", "Verify table adapts to width", "Test touch interactions", "Verify form responsiveness"]',
  'Layout adapts to tablet size, touch targets appropriate, table columns stack if needed, form remains usable',
  '["Test with different tablet orientations", "test with touch gestures", "test with virtual keyboard", "test with different tablet sizes"]'
),

(
  'pay-051',
  'Payment Mobile Layout (375x667)',
  'Payments',
  'Medium',
  '["Set browser to 375x667 resolution", "Verify mobile-optimized layout", "Test touch interactions", "Check navigation menu", "Verify form mobile-friendliness"]',
  'Layout mobile-friendly, touch targets 44px minimum, navigation menu accessible, form optimized for mobile',
  '["Test with different mobile sizes", "test with landscape orientation", "test with touch gestures", "test with virtual keyboard"]'
),

-- Payment Edge Case Tests
(
  'pay-052',
  'Payment Empty State Handling',
  'Payments',
  'Medium',
  '["Test with no payments data", "Test with empty search results", "Test with no filter matches", "Verify empty state messages", "Test empty state actions"]',
  'Empty states display appropriate messages, no errors occur, user can still navigate, clear actions available',
  '["Test with loading states", "test with error states", "test with partial data", "test with data refresh"]'
),

(
  'pay-053',
  'Payment Large Dataset Handling',
  'Payments',
  'Medium',
  '["Test with 1000+ payments", "Test with complex filters", "Test with multiple searches", "Monitor performance metrics", "Verify data integrity"]',
  'Performance remains acceptable, UI remains responsive, memory usage stable, data integrity maintained, user experience smooth',
  '["Test with maximum data limits", "test with concurrent operations", "test with data updates", "test with export operations"]'
),

-- Payment Business Logic Tests
(
  'pay-054',
  'Payment Tax Calculation',
  'Payments',
  'High',
  '["Enter payment amount", "Select tax rate", "Verify tax calculation", "Check total amount", "Verify calculation accuracy"]',
  'Tax calculations are accurate, different rates work correctly, totals calculated properly, no calculation errors',
  '["Test with zero tax rates", "test with very high tax rates", "test with decimal precision", "test with different currencies"]'
),

(
  'pay-055',
  'Payment Discount Application',
  'Payments',
  'High',
  '["Enter payment amount", "Apply discount percentage", "Verify discount calculation", "Check final amount", "Verify calculation accuracy"]',
  'Discount calculations are accurate, different percentages work correctly, final amounts calculated properly, no calculation errors',
  '["Test with zero discounts", "test with 100% discounts", "test with decimal precision", "test with very large amounts"]'
),

(
  'pay-056',
  'Payment Currency Conversion',
  'Payments',
  'Medium',
  '["Select source currency", "Select target currency", "Enter amount", "Verify conversion rate", "Check converted amount"]',
  'Currency conversion works correctly, rates accurate, converted amounts calculated properly, no conversion errors',
  '["Test with different currency pairs", "test with very large amounts", "test with decimal precision", "test with exchange rate updates"]'
),

-- Payment Compliance Tests
(
  'pay-057',
  'Payment PCI DSS Compliance',
  'Payments',
  'High',
  '["Verify card data encryption", "Check secure transmission", "Verify secure storage", "Test access controls", "Verify audit logging"]',
  'PCI DSS compliance maintained, card data properly secured, access controls effective, audit logging comprehensive',
  '["Test with different card types", "test with various data formats", "test with access attempts", "test with audit reviews"]'
),

(
  'pay-058',
  'Payment GDPR Compliance',
  'Payments',
  'Medium',
  '["Verify data consent", "Check data retention", "Test data deletion", "Verify user rights", "Check privacy notices"]',
  'GDPR compliance maintained, user consent properly handled, data retention policies followed, user rights respected',
  '["Test with different user types", "test with various consent scenarios", "test with data requests", "test with privacy updates"]'
),

-- Payment Analytics Tests
(
  'pay-059',
  'Payment Analytics Dashboard',
  'Payments',
  'Medium',
  '["Navigate to Analytics section", "View payment trends", "Check conversion rates", "Verify revenue metrics", "Test date range selection"]',
  'Analytics dashboard displays correctly, trends visible, metrics accurate, date selection works, data updates properly',
  '["Test with different date ranges", "test with various metrics", "test with large datasets", "test with real-time updates"]'
),

(
  'pay-060',
  'Payment Performance Metrics',
  'Payments',
  'Medium',
  '["View payment performance", "Check success rates", "Verify processing times", "Test failure analysis", "Monitor system health"]',
  'Performance metrics display correctly, success rates accurate, processing times tracked, failure analysis comprehensive',
  '["Test with different time periods", "test with various payment methods", "test with system load", "test with error conditions"]'
);

-- Create indexes for better performance on new test cases
CREATE INDEX IF NOT EXISTS idx_qa_tests_payments ON qa_tests(category) WHERE category = 'Payments';
CREATE INDEX IF NOT EXISTS idx_qa_tests_payments_priority ON qa_tests(priority, category) WHERE category = 'Payments';

-- Add comments for documentation
COMMENT ON TABLE qa_tests IS 'Updated to include comprehensive Payments testing scenarios';
COMMENT ON COLUMN qa_tests.category IS 'Test category including Payments for payment management testing scenarios';

-- Verify the insertion
SELECT 'Payments Testing Guide test cases added successfully!' as status;
SELECT 'Total Payments tests: ' || count(*) as test_count FROM qa_tests WHERE category = 'Payments';
SELECT 'Test categories available: ' || string_agg(DISTINCT category, ', ') as categories FROM qa_tests;
