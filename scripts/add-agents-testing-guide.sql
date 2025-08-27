-- Add Agents Testing Guide Test Cases to Database
-- This script adds comprehensive testing scenarios for the Agents management section

-- Insert Agents Testing Guide test cases
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES

-- Agent Dashboard & Metrics Tests
(
  'agt-003',
  'Agent Dashboard Metrics Display',
  'Agents',
  'High',
  '["Navigate to Agents section", "View dashboard metrics cards", "Check Total Agents count", "Verify Total Companies count", "Check New Agents This Month", "Verify Active Agent Percentage"]',
  'All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors',
  '["Test with zero agents", "test with very large numbers", "test with decimal calculations", "test with data updates"]'
),

(
  'agt-004',
  'Agent Dashboard Navigation',
  'Agents',
  'High',
  '["Click on Agents tab", "Click on Companies tab", "Verify tab switching works", "Check content updates correctly", "Test browser back/forward navigation"]',
  'Tab switching works smoothly, content updates correctly, navigation state maintained, no data loss during navigation',
  '["Test with unsaved form data", "test with active filters", "test with selected table rows", "test with browser refresh"]'
),

-- Agent Table Display Tests
(
  'agt-005',
  'Agent Table Initial Load',
  'Agents',
  'High',
  '["Load Agents section", "Wait for table to populate", "Verify all columns are visible", "Check table headers are correct", "Verify data rows are displayed"]',
  'Table loads within 3 seconds, all columns visible, headers correct, data rows displayed, no loading errors',
  '["Test with slow network connection", "test with large datasets", "test with empty data", "test with browser cache disabled"]'
),

(
  'agt-006',
  'Agent Table Column Sorting',
  'Agents',
  'Medium',
  '["Click on ID column header", "Click on Agent Name column header", "Click on Company column header", "Click on Status column header", "Verify sort direction toggles"]',
  'Clicking headers sorts data correctly, sort direction toggles (asc/desc), sort indicators visible, sort persists during navigation',
  '["Test with null values", "test with mixed data types", "test with special characters", "test with very long text"]'
),

(
  'agt-007',
  'Agent Table Pagination',
  'Agents',
  'Medium',
  '["Navigate through different pages", "Change items per page", "Test page size options", "Verify data consistency across pages", "Check page numbers update"]',
  'Page navigation works correctly, page size changes work, data remains consistent, page numbers are accurate',
  '["Test with very large datasets", "test with page size changes", "test with concurrent data updates", "test with network delays"]'
),

-- Agent Search & Filter Tests
(
  'agt-008',
  'Agent Search Functionality',
  'Agents',
  'High',
  '["Enter search terms in search box", "Test agent name searches", "Test email searches", "Test phone number searches", "Verify search results accuracy"]',
  'Search results appear instantly, results match search criteria, no false positives, search highlights matching text',
  '["Test with no results", "test with special characters", "test with very long search terms", "test with SQL injection attempts"]'
),

(
  'agt-009',
  'Agent Filter by Company',
  'Agents',
  'Medium',
  '["Filter by specific company (e.g., Acme Inc)", "Filter by another company (e.g., Globex Corp)", "Test All Companies option", "Check filter persistence", "Verify table updates"]',
  'Company filters work correctly, table shows only matching agents, filter selection persists, clear filter option works',
  '["Test with no agents in company", "test with many companies", "test with company names containing special characters"]'
),

(
  'agt-010',
  'Agent Filter by Status',
  'Agents',
  'Medium',
  '["Filter by Active agents", "Filter by Inactive agents", "Filter by Pending agents", "Test multiple status selections", "Verify filter counts are accurate"]',
  'Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate',
  '["Test with no agents in status", "test with all statuses selected", "test with status changes during filtering"]'
),

-- Agent CRUD Operations Tests
(
  'agt-011',
  'Add New Agent - Form Display',
  'Agents',
  'High',
  '["Click Add New Agent button", "Verify modal opens correctly", "Check all required fields are marked", "Verify form layout is correct", "Test form responsiveness"]',
  'Modal opens smoothly, all required fields marked with asterisks, form layout is clean, responsive design works',
  '["Test with different screen sizes", "test with browser zoom levels", "test with different font sizes", "test with high DPI displays"]'
),

(
  'agt-012',
  'Add New Agent - Required Field Validation',
  'Agents',
  'High',
  '["Leave Agent Name empty", "Leave Company empty", "Leave Email empty", "Leave Phone empty", "Submit form", "Verify validation errors"]',
  'Required field validation works, error messages clear, form highlights problematic fields, user can correct errors easily',
  '["Test with all required fields missing", "test with partial required fields", "test with whitespace only", "test with very long text"]'
),

(
  'agt-013',
  'Add New Agent - Field Format Validation',
  'Agents',
  'High',
  '["Enter invalid email format", "Enter invalid phone format", "Enter invalid commission rate", "Enter invalid start date", "Submit form", "Verify format validation"]',
  'Format validation works correctly, error messages helpful, form prevents submission with invalid data, user guidance clear',
  '["Test with various invalid formats", "test with edge case data", "test with international formats", "test with special characters"]'
),

(
  'agt-014',
  'Add New Agent - Successful Submission',
  'Agents',
  'High',
  '["Fill all required fields correctly", "Fill optional fields", "Upload agent photo", "Submit form", "Verify agent appears in table"]',
  'Form submits successfully, new agent appears in table, success message displayed, modal closes automatically',
  '["Test with maximum field lengths", "test with special characters", "test with large photo files", "test with concurrent submissions"]'
),

(
  'agt-015',
  'Edit Agent - Form Population',
  'Agents',
  'High',
  '["Click Edit button on existing agent", "Verify modal opens with current data", "Check all fields populated correctly", "Verify photo displays correctly", "Test field editing"]',
  'Edit form opens with current agent data, all fields populated correctly, photo displays properly, form is editable',
  '["Test with agents having all fields filled", "test with agents missing optional fields", "test with agents having special characters"]'
),

(
  'agt-016',
  'Edit Agent - Data Updates',
  'Agents',
  'High',
  '["Modify agent name", "Change company assignment", "Update email address", "Change phone number", "Save changes", "Verify updates reflected"]',
  'Changes saved successfully, updated information displays correctly in table, no data corruption occurs, success message shown',
  '["Test with concurrent edits", "test with invalid data", "test with network interruption", "test with large text updates"]'
),

(
  'agt-017',
  'Delete Agent - Confirmation Dialog',
  'Agents',
  'High',
  '["Click Delete button on agent", "Verify confirmation dialog appears", "Check dialog text is clear", "Test dialog close button", "Verify dialog positioning"]',
  'Confirmation dialog appears correctly, text is clear and informative, close button works, dialog properly positioned',
  '["Test with different screen sizes", "test with long agent names", "test with special characters in names", "test with browser zoom"]'
),

(
  'agt-018',
  'Delete Agent - Successful Deletion',
  'Agents',
  'High',
  '["Confirm agent deletion", "Verify agent removed from table", "Check metrics update correctly", "Verify no errors occur", "Test table refresh"]',
  'Agent permanently deleted, table updates immediately, metrics recalculated, success message displayed, no errors',
  '["Test with agents having relationships", "test with agents having photos", "test with network failure during deletion", "test with browser refresh during process"]'
),

-- Agent Photo Management Tests
(
  'agt-019',
  'Agent Photo Upload',
  'Agents',
  'Medium',
  '["Click Choose File button", "Select valid photo file", "Verify file name displayed", "Check file size validation", "Test different file formats"]',
  'File selection works correctly, file name displayed, size validation works, supported formats accepted, upload successful',
  '["Test with very large files", "test with unsupported formats", "test with corrupted files", "test with files having special characters"]'
),

(
  'agt-020',
  'Agent Photo Display',
  'Agents',
  'Medium',
  '["Upload agent photo", "Verify photo displays in form", "Check photo displays in table", "Test photo scaling", "Verify photo quality"]',
  'Photo displays correctly in form and table, proper scaling maintained, quality preserved, no display errors',
  '["Test with different photo sizes", "test with transparent backgrounds", "test with high resolution images", "test with animated GIFs"]'
),

-- Agent Form Field Tests
(
  'agt-021',
  'Agent Name Field Validation',
  'Agents',
  'Medium',
  '["Enter valid agent name", "Test minimum length requirement", "Test maximum length limit", "Test special characters", "Test whitespace handling"]',
  'Agent name validation works correctly, length limits enforced, special characters handled properly, whitespace trimmed',
  '["Test with very long names", "test with names containing numbers", "test with names in different languages", "test with emoji characters"]'
),

(
  'agt-022',
  'Company Assignment Field',
  'Agents',
  'Medium',
  '["Click company dropdown", "Verify company list loads", "Select different companies", "Test search within dropdown", "Verify selection persists"]',
  'Company dropdown works correctly, company list loads, search functionality works, selection persists, no errors',
  '["Test with many companies", "test with company names containing special characters", "test with very long company names", "test with concurrent selections"]'
),

(
  'agt-023',
  'Agent Status Field',
  'Agents',
  'Medium',
  '["Click status dropdown", "Verify status options load", "Select different statuses", "Test status validation", "Verify status updates"]',
  'Status dropdown works correctly, status options load, validation works, status updates properly, selection persists',
  '["Test with all status options", "test with status transitions", "test with invalid status combinations", "test with concurrent status changes"]'
),

(
  'agt-024',
  'Commission Rate Field',
  'Agents',
  'Medium',
  '["Enter valid commission rate", "Test decimal precision", "Test percentage format", "Test range validation", "Verify calculation accuracy"]',
  'Commission rate validation works correctly, decimal precision maintained, percentage format accepted, range validation works',
  '["Test with very high rates", "test with zero rates", "test with negative rates", "test with very long decimal numbers"]'
),

(
  'agt-025',
  'Start Date Field',
  'Agents',
  'Medium',
  '["Click date picker", "Select valid start date", "Test date format", "Test date validation", "Verify date persistence"]',
  'Date picker works correctly, date format consistent, validation works, date persists correctly, no format errors',
  '["Test with future dates", "test with past dates", "test with leap years", "test with different date formats"]'
),

-- Agent Table Interaction Tests
(
  'agt-026',
  'Agent Row Selection',
  'Agents',
  'Medium',
  '["Select individual agent rows", "Select multiple agent rows", "Test select all functionality", "Verify selection state", "Test selection persistence"]',
  'Individual row selection works, multiple row selection works, select all toggles correctly, selection state maintained',
  '["Test with no rows selected", "test with all rows selected", "test with selection during sorting", "test with selection during filtering"]'
),

(
  'agt-027',
  'Agent Table Actions Column',
  'Agents',
  'High',
  '["Verify view icon is green", "Verify edit icon is pencil", "Verify delete icon is red trash can", "Test icon hover effects", "Verify icon accessibility"]',
  'Action icons display correctly, hover effects work, icons are accessible, color coding is clear, functionality obvious',
  '["Test with different screen readers", "test with keyboard navigation", "test with high contrast mode", "test with color blindness simulators"]'
),

-- Agent Responsive Design Tests
(
  'agt-028',
  'Agent Desktop Layout (1920x1080)',
  'Agents',
  'Medium',
  '["Set browser to 1920x1080 resolution", "Verify all elements visible", "Check table displays full columns", "Test horizontal scrolling if needed", "Verify form layout"]',
  'All UI elements fit properly, table shows maximum information, no horizontal scrolling needed, form layout optimized',
  '["Test with different desktop resolutions", "test with browser zoom levels", "test with different font sizes", "test with high DPI displays"]'
),

(
  'agt-029',
  'Agent Tablet Layout (768x1024)',
  'Agents',
  'Medium',
  '["Set browser to 768x1024 resolution", "Check responsive breakpoints", "Verify table adapts to width", "Test touch interactions", "Verify form responsiveness"]',
  'Layout adapts to tablet size, touch targets appropriate, table columns stack if needed, form remains usable',
  '["Test with different tablet orientations", "test with touch gestures", "test with virtual keyboard", "test with different tablet sizes"]'
),

(
  'agt-030',
  'Agent Mobile Layout (375x667)',
  'Agents',
  'Medium',
  '["Set browser to 375x667 resolution", "Verify mobile-optimized layout", "Test touch interactions", "Check navigation menu", "Verify form mobile-friendliness"]',
  'Layout mobile-friendly, touch targets 44px minimum, navigation menu accessible, form optimized for mobile',
  '["Test with different mobile sizes", "test with landscape orientation", "test with touch gestures", "test with virtual keyboard"]'
),

-- Agent Performance Tests
(
  'agt-031',
  'Agent Table Performance',
  'Agents',
  'Medium',
  '["Test with 100+ agents", "Test table sorting performance", "Test search performance", "Test pagination performance", "Monitor memory usage"]',
  'Performance remains acceptable with large datasets, sorting and search respond quickly, pagination smooth, no memory leaks',
  '["Test with maximum data limits", "test with concurrent operations", "test with data updates", "test with network delays"]'
),

(
  'agt-032',
  'Agent Form Performance',
  'Agents',
  'Medium',
  '["Test form load time", "Test form submission time", "Test form validation speed", "Test photo upload performance", "Monitor form responsiveness"]',
  'Form loads quickly, submission responsive, validation instant, photo upload efficient, overall form performance good',
  '["Test with large photo files", "test with complex form data", "test with slow network", "test with limited memory"]'
),

-- Agent Error Handling Tests
(
  'agt-033',
  'Agent Network Error Handling',
  'Agents',
  'High',
  '["Disconnect network connection", "Attempt to add agent", "Attempt to edit agent", "Attempt to delete agent", "Reconnect network", "Verify recovery"]',
  'Error messages displayed, retry options available, application recovers gracefully, user informed of issues',
  '["Test with intermittent connectivity", "test with slow network", "test with timeout scenarios", "test with server errors"]'
),

(
  'agt-034',
  'Agent Form Error Recovery',
  'Agents',
  'High',
  '["Submit form with errors", "Correct validation errors", "Resubmit form", "Verify successful submission", "Check error state cleared"]',
  'Form error recovery works correctly, validation errors clear after correction, successful submission possible, error state properly managed',
  '["Test with multiple validation errors", "test with complex error scenarios", "test with concurrent error corrections", "test with form refresh"]'
),

-- Agent Accessibility Tests
(
  'agt-035',
  'Agent Keyboard Navigation',
  'Agents',
  'High',
  '["Use Tab key to navigate form", "Use Enter/Space to activate buttons", "Use arrow keys in table", "Test escape key functionality", "Verify focus management"]',
  'All interactive elements reachable, focus indicators visible, keyboard shortcuts work, no keyboard traps, focus management proper',
  '["Test with screen reader", "test with keyboard-only navigation", "test with different keyboard layouts", "test with assistive technologies"]'
),

(
  'agt-036',
  'Agent Screen Reader Compatibility',
  'Agents',
  'High',
  '["Enable screen reader software", "Navigate through agent form", "Verify proper labeling", "Check semantic structure", "Test table accessibility"]',
  'Screen reader announces elements correctly, form labels properly associated, table structure semantic, navigation logical',
  '["Test with different screen readers", "test with different languages", "test with complex data", "test with dynamic content"]'
),

-- Agent Cross-Browser Tests
(
  'agt-037',
  'Agent Chrome Compatibility',
  'Agents',
  'Medium',
  '["Test all agent features in Chrome", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify table interactions"]',
  'All agent features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Chrome versions", "test with Chrome extensions", "test with Chrome DevTools", "test with Chrome flags"]'
),

(
  'agt-038',
  'Agent Firefox Compatibility',
  'Agents',
  'Medium',
  '["Test all agent features in Firefox", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify table interactions"]',
  'All agent features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Firefox versions", "test with Firefox add-ons", "test with Firefox Developer Tools", "test with Firefox preferences"]'
),

(
  'agt-039',
  'Agent Safari Compatibility',
  'Agents',
  'Medium',
  '["Test all agent features in Safari", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions", "Verify table interactions"]',
  'All agent features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Safari versions", "test with Safari Developer Tools", "test with Safari preferences", "test with Safari extensions"]'
),

-- Agent Edge Case Tests
(
  'agt-040',
  'Agent Empty State Handling',
  'Agents',
  'Medium',
  '["Test with no agents data", "Test with empty search results", "Test with no filter matches", "Verify empty state messages", "Test empty state actions"]',
  'Empty states display appropriate messages, no errors occur, user can still navigate, clear actions available',
  '["Test with loading states", "test with error states", "test with partial data", "test with data refresh"]'
),

(
  'agt-041',
  'Agent Large Dataset Handling',
  'Agents',
  'Medium',
  '["Test with 1000+ agents", "Test with complex filters", "Test with multiple searches", "Monitor performance metrics", "Verify data integrity"]',
  'Performance remains acceptable, UI remains responsive, memory usage stable, data integrity maintained, user experience smooth',
  '["Test with maximum data limits", "test with concurrent operations", "test with data updates", "test with export operations"]'
),

-- Agent Commission & Performance Tests
(
  'agt-042',
  'Agent Commission Calculation',
  'Agents',
  'High',
  '["Set commission rate for agent", "Add sales transactions", "Verify commission calculations", "Test different rate types", "Check calculation accuracy"]',
  'Commission calculations are accurate, different rate types work correctly, calculations update in real-time, no calculation errors',
  '["Test with very high rates", "test with zero rates", "test with decimal precision", "test with currency conversions"]'
),

(
  'agt-043',
  'Agent Performance Metrics',
  'Agents',
  'Medium',
  '["View agent performance dashboard", "Check sales metrics", "Verify commission totals", "Test performance filters", "Monitor real-time updates"]',
  'Performance metrics display correctly, real-time updates work, filters function properly, data accuracy maintained',
  '["Test with large datasets", "test with concurrent updates", "test with network delays", "test with data refresh"]'
),

-- Agent Relationship Tests
(
  'agt-044',
  'Agent-Company Relationship',
  'Agents',
  'Medium',
  '["Assign agent to company", "Change agent company", "Verify relationship updates", "Test relationship validation", "Check data consistency"]',
  'Agent-company relationships work correctly, updates propagate properly, validation prevents invalid relationships, data remains consistent',
  '["Test with orphaned agents", "test with company deletions", "test with relationship conflicts", "test with concurrent updates"]'
),

(
  'agt-045',
  'Agent-Client Relationship',
  'Agents',
  'Medium',
  '["Assign clients to agent", "View agent client list", "Test client reassignment", "Verify relationship tracking", "Check data integrity"]',
  'Agent-client relationships work correctly, assignments track properly, reassignments function, data integrity maintained',
  '["Test with many clients", "test with client deletions", "test with relationship conflicts", "test with concurrent assignments"]'
);

-- Create indexes for better performance on new test cases
CREATE INDEX IF NOT EXISTS idx_qa_tests_agents ON qa_tests(category) WHERE category = 'Agents';
CREATE INDEX IF NOT EXISTS idx_qa_tests_agents_priority ON qa_tests(priority, category) WHERE category = 'Agents';

-- Add comments for documentation
COMMENT ON TABLE qa_tests IS 'Updated to include comprehensive Agents testing scenarios';
COMMENT ON COLUMN qa_tests.category IS 'Test category including Agents for agent management testing scenarios';

-- Verify the insertion
SELECT 'Agents Testing Guide test cases added successfully!' as status;
SELECT 'Total Agents tests: ' || count(*) as test_count FROM qa_tests WHERE category = 'Agents';
SELECT 'Test categories available: ' || string_agg(DISTINCT category, ', ') as categories FROM qa_tests;
