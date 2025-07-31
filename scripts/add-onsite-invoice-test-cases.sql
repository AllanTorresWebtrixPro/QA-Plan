-- Add comprehensive On-Site Invoice test cases to the QA database

INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  -- On-Site Invoice Dashboard
  (
    'osi-001',
    'On-Site Invoice Dashboard Display',
    'On-Site Invoices',
    'High',
    '["Navigate to on-site invoices dashboard", "Verify KPI cards display correctly", "Check total invoices count", "Verify total amounts calculation", "Check pending/paid counts"]',
    'Dashboard shows accurate invoice statistics and KPI metrics',
    '["Test with no invoices", "very large amounts", "zero pending invoices"]'
  ),
  (
    'osi-002',
    'On-Site Invoice Dashboard Filtering',
    'On-Site Invoices',
    'High',
    '["Use date range filters", "Apply status filters", "Use client/brand filters", "Test search functionality", "Clear all filters"]',
    'All filters work correctly and return accurate results',
    '["Test with no matching results", "overlapping date ranges", "special characters in search"]'
  ),
  (
    'osi-003',
    'On-Site Invoice Date Formatting',
    'On-Site Invoices',
    'Medium',
    '["Check all date fields in dashboard", "Verify Month Day, Year format consistency", "Test different date ranges", "Check date sorting"]',
    'All dates display in consistent Month Day, Year format',
    '["Test with null dates", "future dates", "very old dates"]'
  ),

  -- On-Site Invoice Table Display
  (
    'osi-004',
    'On-Site Invoice Table Display',
    'On-Site Invoices',
    'High',
    '["Navigate to invoices table", "Verify all columns display correctly", "Check data alignment", "Test table responsiveness", "Verify pagination"]',
    'Table displays all invoice data with proper alignment and formatting',
    '["Test with 0 invoices", "1000+ invoices", "very long client names"]'
  ),
  (
    'osi-005',
    'On-Site Invoice Table Sorting',
    'On-Site Invoices',
    'Medium',
    '["Click column headers to sort", "Test ascending/descending order", "Sort by date, amount, status", "Verify sort indicators"]',
    'All columns sort correctly with proper indicators',
    '["Test sorting with null values", "identical values", "mixed data types"]'
  ),
  (
    'osi-006',
    'On-Site Invoice Status Badges',
    'On-Site Invoices',
    'Medium',
    '["Verify status badge colors", "Check badge text accuracy", "Test different invoice statuses", "Verify badge consistency"]',
    'Status badges display with correct colors and text for each status',
    '["Test with undefined status", "status transitions", "custom statuses"]'
  ),
  (
    'osi-007',
    'On-Site Invoice Action Buttons',
    'On-Site Invoices',
    'High',
    '["Verify action buttons based on invoice status", "Test View button availability", "Test Edit button permissions", "Test Delete button conditions"]',
    'Action buttons display correctly based on invoice status and user permissions',
    '["Test with different user roles", "locked invoices", "paid invoices"]'
  ),

  -- On-Site Invoice Viewing
  (
    'osi-008',
    'On-Site Invoice Detail View Dialog',
    'On-Site Invoices',
    'High',
    '["Click View button on invoice", "Verify dialog opens correctly", "Check invoice header information", "Verify dialog responsiveness"]',
    'Invoice detail dialog opens with complete invoice information',
    '["Test with very long invoice data", "missing invoice data", "corrupted data"]'
  ),
  (
    'osi-009',
    'On-Site Invoice Items Display',
    'On-Site Invoices',
    'High',
    '["View invoice items in detail dialog", "Verify item descriptions", "Check quantities and prices", "Verify calculations (subtotal, tax, total)"]',
    'All invoice items display correctly with accurate calculations',
    '["Test with 0 items", "many items", "items with special characters"]'
  ),
  (
    'osi-010',
    'On-Site Invoice Client Information',
    'On-Site Invoices',
    'Medium',
    '["Verify client name display", "Check client contact information", "Verify address formatting", "Test client data consistency"]',
    'Client information displays correctly with proper formatting',
    '["Test with missing client data", "very long client names", "special characters"]'
  ),

  -- On-Site Invoice Editing
  (
    'osi-011',
    'On-Site Invoice Edit Dialog',
    'On-Site Invoices',
    'High',
    '["Click Edit button on invoice", "Verify edit dialog opens", "Check form fields are populated", "Test form validation"]',
    'Edit dialog opens with current invoice data and proper validation',
    '["Test with locked invoices", "paid invoices", "missing permissions"]'
  ),
  (
    'osi-012',
    'On-Site Invoice Item Management',
    'On-Site Invoices',
    'High',
    '["Add new invoice items", "Edit existing items", "Remove items", "Verify calculations update", "Test item validation"]',
    'Invoice items can be managed correctly with real-time calculation updates',
    '["Test with maximum items", "zero quantity items", "negative amounts"]'
  ),
  (
    'osi-013',
    'On-Site Invoice CC Fee Management',
    'On-Site Invoices',
    'High',
    '["Toggle CC fee option", "Verify fee calculation", "Test different fee percentages", "Check fee display in totals"]',
    'CC fees calculate correctly and display properly in invoice totals',
    '["Test with zero amounts", "very large amounts", "custom fee rates"]'
  ),
  (
    'osi-014',
    'On-Site Invoice Update Submission',
    'On-Site Invoices',
    'High',
    '["Make changes to invoice", "Click save/update button", "Verify success message", "Check data persistence", "Verify table updates"]',
    'Invoice updates save successfully and reflect in the system',
    '["Test with network interruptions", "concurrent edits", "validation errors"]'
  ),

  -- On-Site Invoice Payment Processing
  (
    'osi-015',
    'On-Site Invoice QR Code Generation',
    'On-Site Invoices',
    'High',
    '["Generate QR code for invoice", "Verify QR code displays", "Test QR code scanning", "Verify QR code links to payment page"]',
    'QR codes generate correctly and link to proper payment pages',
    '["Test with very large invoices", "special characters in invoice data", "expired invoices"]'
  ),
  (
    'osi-016',
    'On-Site Invoice Payment Link Generation',
    'On-Site Invoices',
    'High',
    '["Generate payment link", "Copy payment link", "Test link accessibility", "Verify link expiration"]',
    'Payment links generate correctly and remain accessible until expiration',
    '["Test with expired links", "invalid invoice IDs", "already paid invoices"]'
  ),
  (
    'osi-017',
    'On-Site Invoice Payment Page Access',
    'On-Site Invoices',
    'High',
    '["Access payment page via link/QR", "Verify page loads correctly", "Check invoice information display", "Test page responsiveness"]',
    'Payment page loads correctly with accurate invoice information',
    '["Test on mobile devices", "slow network connections", "invalid payment links"]'
  ),
  (
    'osi-018',
    'On-Site Invoice Payment Form Validation',
    'On-Site Invoices',
    'High',
    '["Test required field validation", "Test credit card validation", "Test email validation", "Test form submission with invalid data"]',
    'Payment form validates all inputs correctly and shows appropriate error messages',
    '["Test with expired cards", "invalid card numbers", "special characters"]'
  ),
  (
    'osi-019',
    'On-Site Invoice Payment Gateway Integration',
    'On-Site Invoices',
    'High',
    '["Submit valid payment", "Verify gateway communication", "Test payment processing", "Check payment confirmation"]',
    'Payment processes successfully through gateway with proper confirmation',
    '["Test with declined cards", "network timeouts", "gateway errors"]'
  ),
  (
    'osi-020',
    'On-Site Invoice Payment Success Flow',
    'On-Site Invoices',
    'High',
    '["Complete successful payment", "Verify success page display", "Check payment confirmation email", "Verify invoice status update"]',
    'Payment success flow completes with proper confirmations and status updates',
    '["Test email delivery failures", "status update delays", "partial payments"]'
  ),

  -- On-Site Invoice Individual Page
  (
    'osi-021',
    'On-Site Invoice Individual Page Access',
    'On-Site Invoices',
    'Medium',
    '["Navigate to individual invoice page", "Verify page loads correctly", "Check URL structure", "Test direct link access"]',
    'Individual invoice pages load correctly with proper URL structure',
    '["Test with invalid invoice IDs", "deleted invoices", "unauthorized access"]'
  ),
  (
    'osi-022',
    'On-Site Invoice Page Action Buttons',
    'On-Site Invoices',
    'Medium',
    '["Verify View button functionality", "Test Edit button access", "Check Delete button permissions", "Test button states"]',
    'Action buttons work correctly based on invoice status and user permissions',
    '["Test with different user roles", "locked invoices", "paid invoices"]'
  ),
  (
    'osi-023',
    'On-Site Invoice Deletion Workflow',
    'On-Site Invoices',
    'High',
    '["Click Delete button", "Verify confirmation dialog", "Confirm deletion", "Check invoice removal", "Verify related data cleanup"]',
    'Invoice deletion workflow completes successfully with proper confirmations',
    '["Test with invoices having payments", "related records", "concurrent access"]'
  ),

  -- On-Site Invoice Integration
  (
    'osi-024',
    'On-Site Invoice Status Workflow',
    'On-Site Invoices',
    'High',
    '["Create new invoice", "Update invoice status", "Process payment", "Verify status transitions", "Check workflow triggers"]',
    'Invoice status workflow operates correctly with proper state transitions',
    '["Test invalid status transitions", "concurrent status updates", "workflow interruptions"]'
  ),
  (
    'osi-025',
    'On-Site Invoice Data Consistency',
    'On-Site Invoices',
    'High',
    '["Create/update invoice", "Verify data across all views", "Check related record updates", "Test data synchronization"]',
    'Invoice data remains consistent across all system operations and views',
    '["Test with concurrent operations", "data conflicts", "partial updates"]'
  ),
  (
    'osi-026',
    'On-Site Invoice Reporting Integration',
    'On-Site Invoices',
    'Medium',
    '["Generate invoice reports", "Verify data accuracy in reports", "Test different report formats", "Check report calculations"]',
    'Invoice data integrates correctly with reporting system and calculations are accurate',
    '["Test with large datasets", "missing data", "report generation failures"]'
  ),

  -- Additional On-Site Invoice Tests
  (
    'osi-027',
    'On-Site Invoice Search Functionality',
    'On-Site Invoices',
    'Medium',
    '["Search by invoice number", "Search by client name", "Search by amount range", "Test advanced search options"]',
    'Search functionality returns accurate results for all search criteria',
    '["Test with partial matches", "special characters", "very long search terms"]'
  ),
  (
    'osi-028',
    'On-Site Invoice Bulk Operations',
    'On-Site Invoices',
    'Medium',
    '["Select multiple invoices", "Test bulk status updates", "Test bulk export", "Verify bulk operation confirmations"]',
    'Bulk operations work correctly with proper confirmations and error handling',
    '["Test with mixed invoice statuses", "large selections", "operation failures"]'
  ),
  (
    'osi-029',
    'On-Site Invoice Email Functionality',
    'On-Site Invoices',
    'Medium',
    '["Send invoice via email", "Verify email content", "Test email delivery", "Check email templates"]',
    'Invoice emails send successfully with correct content and formatting',
    '["Test with invalid email addresses", "email delivery failures", "template errors"]'
  ),
  (
    'osi-030',
    'On-Site Invoice Print Functionality',
    'On-Site Invoices',
    'Medium',
    '["Generate printable invoice", "Verify print layout", "Test PDF generation", "Check print formatting"]',
    'Invoice printing and PDF generation work correctly with proper formatting',
    '["Test with very long invoices", "special characters", "print failures"]'
  ),

  -- On-Site Invoice Performance and Security
  (
    'osi-031',
    'On-Site Invoice Performance Testing',
    'On-Site Invoices',
    'Medium',
    '["Test with large invoice datasets", "Measure page load times", "Test concurrent user access", "Verify system responsiveness"]',
    'System performs well with large datasets and concurrent access',
    '["Test with maximum data limits", "peak usage scenarios", "resource constraints"]'
  ),
  (
    'osi-032',
    'On-Site Invoice Security Testing',
    'On-Site Invoices',
    'High',
    '["Test access permissions", "Verify data encryption", "Test payment security", "Check audit logging"]',
    'Invoice system maintains proper security with encrypted data and audit trails',
    '["Test with unauthorized access attempts", "data tampering", "security vulnerabilities"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the on-site invoice test cases were added
SELECT 'On-Site Invoice test cases added successfully!' as status;
SELECT 'On-Site Invoice tests added: ' || count(*) as onsite_invoice_test_count FROM qa_tests WHERE category = 'On-Site Invoices';
SELECT 'Total tests now: ' || count(*) as total_test_count FROM qa_tests;
