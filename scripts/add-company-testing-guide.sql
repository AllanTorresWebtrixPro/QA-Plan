-- Add Company Testing Guide Test Cases to Database
-- This script adds comprehensive testing scenarios for the Company management section

-- Insert Company Testing Guide test cases
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES

-- Company Dashboard & Metrics Tests
(
  'com-001',
  'Company Dashboard Metrics Display',
  'Company',
  'High',
  '["Navigate to Company section", "View dashboard metrics cards", "Check Total Companies count", "Verify Total Agents count", "Check New Agents This Month", "Verify Active Agent Percentage"]',
  'All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors',
  '["Test with zero companies", "test with very large numbers", "test with decimal calculations", "test with data updates"]'
),

(
  'com-002',
  'Company Dashboard Navigation',
  'Company',
  'High',
  '["Click on Companies tab", "Click on Agents tab", "Verify tab switching works", "Check content updates correctly", "Test browser back/forward navigation"]',
  'Tab switching works smoothly, content updates correctly, navigation state maintained, no data loss during navigation',
  '["Test with unsaved form data", "test with active filters", "test with selected table rows", "test with browser refresh"]'
),

-- Company Table Display Tests
(
  'com-003',
  'Company Table Initial Load',
  'Company',
  'High',
  '["Load Company section", "Wait for table to populate", "Verify all columns are visible", "Check table headers are correct", "Verify data rows are displayed"]',
  'Table loads within 3 seconds, all columns visible, headers correct, data rows displayed, no loading errors',
  '["Test with slow network connection", "test with large datasets", "test with empty data", "test with browser cache disabled"]'
),

(
  'com-004',
  'Company Table Column Sorting',
  'Company',
  'Medium',
  '["Click on ID column header", "Click on Company Name column header", "Click on Country column header", "Click on City column header", "Verify sort direction toggles"]',
  'Clicking headers sorts data correctly, sort direction toggles (asc/desc), sort indicators visible, sort persists during navigation',
  '["Test with null values", "test with mixed data types", "test with special characters", "test with very long text"]'
),

(
  'com-005',
  'Company Table Pagination',
  'Company',
  'Medium',
  '["Navigate through different pages", "Change items per page", "Test page size options", "Verify data consistency across pages", "Check page numbers update"]',
  'Page navigation works correctly, page size changes work, data remains consistent, page numbers are accurate',
  '["Test with very large datasets", "test with page size changes", "test with concurrent data updates", "test with network delays"]'
),

-- Company Search & Filter Tests
(
  'com-006',
  'Company Search Functionality',
  'Company',
  'High',
  '["Enter search terms in search box", "Test company name searches", "Test email searches", "Test phone number searches", "Verify search results accuracy"]',
  'Search results appear instantly, results match search criteria, no false positives, search highlights matching text',
  '["Test with no results", "test with special characters", "test with very long search terms", "test with SQL injection attempts"]'
),

(
  'com-007',
  'Company Filter by Country',
  'Company',
  'Medium',
  '["Filter by specific country (e.g., AR)", "Filter by another country (e.g., UK)", "Test All Countries option", "Check filter persistence", "Verify table updates"]',
  'Country filters work correctly, table shows only matching companies, filter selection persists, clear filter option works',
  '["Test with no companies in country", "test with many countries", "test with country names containing special characters"]'
),

(
  'com-008',
  'Company Filter by Status',
  'Company',
  'Medium',
  '["Filter by Active companies", "Filter by Inactive companies", "Test multiple status selections", "Verify filter counts are accurate", "Check filter combination logic"]',
  'Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate',
  '["Test with no companies in status", "test with all statuses selected", "test with status changes during filtering"]'
),

-- Company CRUD Operations Tests
(
  'com-009',
  'Add New Company - Form Display',
  'Company',
  'High',
  '["Click Add New Company button", "Verify modal opens correctly", "Check all required fields are marked", "Verify form layout is correct", "Test form responsiveness"]',
  'Modal opens smoothly, all required fields marked with asterisks, form layout is clean, responsive design works',
  '["Test with different screen sizes", "test with browser zoom levels", "test with different font sizes", "test with high DPI displays"]'
),

(
  'com-010',
  'Add New Company - Required Field Validation',
  'Company',
  'High',
  '["Leave Company Name empty", "Leave Country empty", "Leave Email empty", "Leave Phone empty", "Submit form", "Verify validation errors"]',
  'Required field validation works, error messages clear, form highlights problematic fields, user can correct errors easily',
  '["Test with all required fields missing", "test with partial required fields", "test with whitespace only", "test with very long text"]'
),

(
  'com-011',
  'Add New Company - Field Format Validation',
  'Company',
  'High',
  '["Enter invalid email format", "Enter invalid phone format", "Enter invalid website URL", "Enter invalid zip code", "Submit form", "Verify format validation"]',
  'Format validation works correctly, error messages helpful, form prevents submission with invalid data, user guidance clear',
  '["Test with various invalid formats", "test with edge case data", "test with international formats", "test with special characters"]'
),

(
  'com-012',
  'Add New Company - Successful Submission',
  'Company',
  'High',
  '["Fill all required fields correctly", "Fill optional fields", "Upload company logo", "Submit form", "Verify company appears in table"]',
  'Form submits successfully, new company appears in table, success message displayed, modal closes automatically',
  '["Test with maximum field lengths", "test with special characters", "test with large logo files", "test with concurrent submissions"]'
),

(
  'com-013',
  'Edit Company - Form Population',
  'Company',
  'High',
  '["Click Edit button on existing company", "Verify modal opens with current data", "Check all fields populated correctly", "Verify logo displays correctly", "Test field editing"]',
  'Edit form opens with current company data, all fields populated correctly, logo displays properly, form is editable',
  '["Test with companies having all fields filled", "test with companies missing optional fields", "test with companies having special characters"]'
),

(
  'com-014',
  'Edit Company - Data Updates',
  'Company',
  'High',
  '["Modify company name", "Change country selection", "Update email address", "Change phone number", "Save changes", "Verify updates reflected"]',
  'Changes saved successfully, updated information displays correctly in table, no data corruption occurs, success message shown',
  '["Test with concurrent edits", "test with invalid data", "test with network interruption", "test with large text updates"]'
),

(
  'com-015',
  'Delete Company - Confirmation Dialog',
  'Company',
  'High',
  '["Click Delete button on company", "Verify confirmation dialog appears", "Check dialog text is clear", "Test dialog close button", "Verify dialog positioning"]',
  'Confirmation dialog appears correctly, text is clear and informative, close button works, dialog properly positioned',
  '["Test with different screen sizes", "test with long company names", "test with special characters in names", "test with browser zoom"]'
),

(
  'com-016',
  'Delete Company - Successful Deletion',
  'Company',
  'High',
  '["Confirm company deletion", "Verify company removed from table", "Check metrics update correctly", "Verify no errors occur", "Test table refresh"]',
  'Company permanently deleted, table updates immediately, metrics recalculated, success message displayed, no errors',
  '["Test with companies having relationships", "test with companies having logos", "test with network failure during deletion", "test with browser refresh during process"]'
),

-- Company Logo Management Tests
(
  'com-017',
  'Company Logo Upload',
  'Company',
  'Medium',
  '["Click Choose File button", "Select valid logo file", "Verify file name displayed", "Check file size validation", "Test different file formats"]',
  'File selection works correctly, file name displayed, size validation works, supported formats accepted, upload successful',
  '["Test with very large files", "test with unsupported formats", "test with corrupted files", "test with files having special characters"]'
),

(
  'com-018',
  'Company Logo Display',
  'Company',
  'Medium',
  '["Upload company logo", "Verify logo displays in form", "Check logo displays in table", "Test logo scaling", "Verify logo quality"]',
  'Logo displays correctly in form and table, proper scaling maintained, quality preserved, no display errors',
  '["Test with different logo sizes", "test with transparent backgrounds", "test with high resolution images", "test with animated GIFs"]'
),

-- Company Form Field Tests
(
  'com-019',
  'Company Name Field Validation',
  'Company',
  'Medium',
  '["Enter valid company name", "Test minimum length requirement", "Test maximum length limit", "Test special characters", "Test whitespace handling"]',
  'Company name validation works correctly, length limits enforced, special characters handled properly, whitespace trimmed',
  '["Test with very long names", "test with names containing numbers", "test with names in different languages", "test with emoji characters"]'
),

(
  'com-020',
  'Country Selection Field',
  'Company',
  'Medium',
  '["Click country dropdown", "Verify country list loads", "Select different countries", "Test search within dropdown", "Verify selection persists"]',
  'Country dropdown works correctly, country list loads, search functionality works, selection persists, no errors',
  '["Test with many countries", "test with country names containing special characters", "test with very long country names", "test with concurrent selections"]'
),

(
  'com-021',
  'State Selection Field',
  'Company',
  'Medium',
  '["Select a country", "Verify state dropdown updates", "Select different states", "Test state-country relationship", "Verify state selection"]',
  'State dropdown updates based on country, state selection works, relationship logic correct, selection persists',
  '["Test with countries having many states", "test with countries having no states", "test with state names containing special characters"]'
),

(
  'com-022',
  'Email Field Validation',
  'Company',
  'High',
  '["Enter valid email format", "Test invalid email formats", "Test email length limits", "Test special characters", "Verify email uniqueness"]',
  'Email validation works correctly, invalid formats rejected, length limits enforced, special characters handled, uniqueness checked',
  '["Test with very long emails", "test with international domains", "test with subdomains", "test with email containing numbers"]'
),

(
  'com-023',
  'Phone Field Validation',
  'Company',
  'High',
  '["Enter valid phone format", "Test invalid phone formats", "Test international formats", "Test phone length limits", "Verify phone uniqueness"]',
  'Phone validation works correctly, invalid formats rejected, international formats accepted, length limits enforced, uniqueness checked',
  '["Test with very long phone numbers", "test with different country codes", "test with extensions", "test with special characters"]'
),

(
  'com-024',
  'Website Field Validation',
  'Company',
  'Medium',
  '["Enter valid website URL", "Test invalid URL formats", "Test URL length limits", "Test protocol handling", "Verify URL accessibility"]',
  'Website validation works correctly, invalid URLs rejected, length limits enforced, protocol handling correct, accessibility verified',
  '["Test with very long URLs", "test with different protocols (http, https, ftp)", "test with subdomains", "test with query parameters"]'
),

-- Company Table Interaction Tests
(
  'com-025',
  'Company Row Selection',
  'Company',
  'Medium',
  '["Select individual company rows", "Select multiple company rows", "Test select all functionality", "Verify selection state", "Test selection persistence"]',
  'Individual row selection works, multiple row selection works, select all toggles correctly, selection state maintained',
  '["Test with no rows selected", "test with all rows selected", "test with selection during sorting", "test with selection during filtering"]'
),

(
  'com-026',
  'Company Table Actions Column',
  'Company',
  'High',
  '["Verify view icon is green", "Verify edit icon is pencil", "Verify delete icon is red trash can", "Test icon hover effects", "Verify icon accessibility"]',
  'Action icons display correctly, hover effects work, icons are accessible, color coding is clear, functionality obvious',
  '["Test with different screen readers", "test with keyboard navigation", "test with high contrast mode", "test with color blindness simulators"]'
),

-- Company Responsive Design Tests
(
  'com-027',
  'Company Desktop Layout (1920x1080)',
  'Company',
  'Medium',
  '["Set browser to 1920x1080 resolution", "Verify all elements visible", "Check table displays full columns", "Test horizontal scrolling if needed", "Verify form layout"]',
  'All UI elements fit properly, table shows maximum information, no horizontal scrolling needed, form layout optimized',
  '["Test with different desktop resolutions", "test with browser zoom levels", "test with different font sizes", "test with high DPI displays"]'
),

(
  'com-028',
  'Company Tablet Layout (768x1024)',
  'Company',
  'Medium',
  '["Set browser to 768x1024 resolution", "Check responsive breakpoints", "Verify table adapts to width", "Test touch interactions", "Verify form responsiveness"]',
  'Layout adapts to tablet size, touch targets appropriate, table columns stack if needed, form remains usable',
  '["Test with different tablet orientations", "test with touch gestures", "test with virtual keyboard", "test with different tablet sizes"]'
),

(
  'com-029',
  'Company Mobile Layout (375x667)',
  'Company',
  'Medium',
  '["Set browser to 375x667 resolution", "Verify mobile-optimized layout", "Test touch interactions", "Check navigation menu", "Verify form mobile-friendliness"]',
  'Layout mobile-friendly, touch targets 44px minimum, navigation menu accessible, form optimized for mobile',
  '["Test with different mobile sizes", "test with landscape orientation", "test with touch gestures", "test with virtual keyboard"]'
),

-- Company Performance Tests
(
  'com-030',
  'Company Table Performance',
  'Company',
  'Medium',
  '["Test with 100+ companies", "Test table sorting performance", "Test search performance", "Test pagination performance", "Monitor memory usage"]',
  'Performance remains acceptable with large datasets, sorting and search respond quickly, pagination smooth, no memory leaks',
  '["Test with maximum data limits", "test with concurrent operations", "test with data updates", "test with network delays"]'
),

(
  'com-031',
  'Company Form Performance',
  'Company',
  'Medium',
  '["Test form load time", "Test form submission time", "Test form validation speed", "Test file upload performance", "Monitor form responsiveness"]',
  'Form loads quickly, submission responsive, validation instant, file upload efficient, overall form performance good',
  '["Test with large logo files", "test with complex form data", "test with slow network", "test with limited memory"]'
),

-- Company Error Handling Tests
(
  'com-032',
  'Company Network Error Handling',
  'Company',
  'High',
  '["Disconnect network connection", "Attempt to add company", "Attempt to edit company", "Attempt to delete company", "Reconnect network", "Verify recovery"]',
  'Error messages displayed, retry options available, application recovers gracefully, user informed of issues',
  '["Test with intermittent connectivity", "test with slow network", "test with timeout scenarios", "test with server errors"]'
),

(
  'com-033',
  'Company Form Error Recovery',
  'Company',
  'High',
  '["Submit form with errors", "Correct validation errors", "Resubmit form", "Verify successful submission", "Check error state cleared"]',
  'Form error recovery works correctly, validation errors clear after correction, successful submission possible, error state properly managed',
  '["Test with multiple validation errors", "test with complex error scenarios", "test with concurrent error corrections", "test with form refresh"]'
),

-- Company Accessibility Tests
(
  'com-034',
  'Company Keyboard Navigation',
  'Company',
  'High',
  '["Use Tab key to navigate form", "Use Enter/Space to activate buttons", "Use arrow keys in table", "Test escape key functionality", "Verify focus management"]',
  'All interactive elements reachable, focus indicators visible, keyboard shortcuts work, no keyboard traps, focus management proper',
  '["Test with screen reader", "test with keyboard-only navigation", "test with different keyboard layouts", "test with assistive technologies"]'
),

(
  'com-035',
  'Company Screen Reader Compatibility',
  'Company',
  'High',
  '["Enable screen reader software", "Navigate through company form", "Verify proper labeling", "Check semantic structure", "Test table accessibility"]',
  'Screen reader announces elements correctly, form labels properly associated, table structure semantic, navigation logical',
  '["Test with different screen readers", "test with different languages", "test with complex data", "test with dynamic content"]'
),

-- Company Cross-Browser Tests
(
  'com-036',
  'Company Chrome Compatibility',
  'Company',
  'Medium',
  '["Test all company features in Chrome", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify table interactions"]',
  'All company features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Chrome versions", "test with Chrome extensions", "test with Chrome DevTools", "test with Chrome flags"]'
),

(
  'com-037',
  'Company Firefox Compatibility',
  'Company',
  'Medium',
  '["Test all company features in Firefox", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify table interactions"]',
  'All company features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Firefox versions", "test with Firefox add-ons", "test with Firefox Developer Tools", "test with Firefox preferences"]'
),

(
  'com-038',
  'Company Safari Compatibility',
  'Company',
  'Medium',
  '["Test all company features in Safari", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify table interactions"]',
  'All company features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Safari versions", "test with Safari Developer Tools", "test with Safari preferences", "test with Safari extensions"]'
),

-- Company Edge Case Tests
(
  'com-039',
  'Company Empty State Handling',
  'Company',
  'Medium',
  '["Test with no companies data", "Test with empty search results", "Test with no filter matches", "Verify empty state messages", "Test empty state actions"]',
  'Empty states display appropriate messages, no errors occur, user can still navigate, clear actions available',
  '["Test with loading states", "test with error states", "test with partial data", "test with data refresh"]'
),

(
  'com-040',
  'Company Large Dataset Handling',
  'Company',
  'Medium',
  '["Test with 1000+ companies", "Test with complex filters", "Test with multiple searches", "Monitor performance metrics", "Verify data integrity"]',
  'Performance remains acceptable, UI remains responsive, memory usage stable, data integrity maintained, user experience smooth',
  '["Test with maximum data limits", "test with concurrent operations", "test with data updates", "test with export operations"]'
);

-- Create indexes for better performance on new test cases
CREATE INDEX IF NOT EXISTS idx_qa_tests_company ON qa_tests(category) WHERE category = 'Company';
CREATE INDEX IF NOT EXISTS idx_qa_tests_company_priority ON qa_tests(priority, category) WHERE category = 'Company';

-- Add comments for documentation
COMMENT ON TABLE qa_tests IS 'Updated to include comprehensive Company testing scenarios';
COMMENT ON COLUMN qa_tests.category IS 'Test category including Company for company management testing scenarios';

-- Verify the insertion
SELECT 'Company Testing Guide test cases added successfully!' as status;
SELECT 'Total Company tests: ' || count(*) as test_count FROM qa_tests WHERE category = 'Company';
SELECT 'Test categories available: ' || string_agg(DISTINCT category, ', ') as categories FROM qa_tests;
