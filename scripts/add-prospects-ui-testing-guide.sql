-- Add Prospects Testing Guide Test Cases to Database
-- This script adds comprehensive UI testing scenarios for the Prospects section

-- Insert Prospects Testing Guide test cases
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES

-- Page Loading & Navigation Tests
(
  'pro-ui-001',
  'Page Initial Load - Prospects Section',
  'Prospects',
  'High',
  '["Navigate to the Prospects section", "Wait for page to fully load", "Verify all components are visible", "Check for loading spinners or placeholders"]',
  'Page loads within 3 seconds, all UI elements visible, no broken images or missing icons, no console errors in browser dev tools',
  '["Test with slow network connection", "test with large datasets", "test with browser cache disabled"]'
),

(
  'pro-ui-002',
  'Navigation Between Prospects Views',
  'Prospects',
  'High',
  '["Click on Dashboard tab", "Click on All Prospects tab", "Click on Reports tab", "Use browser back/forward buttons"]',
  'Smooth transitions between views, URL updates correctly, browser navigation works properly, no data loss during navigation',
  '["Test with unsaved form data", "test with active filters", "test with selected table rows"]'
),

-- Dashboard Metrics Tests
(
  'pro-ui-003',
  'Dashboard Metrics Display',
  'Prospects',
  'High',
  '["View the dashboard metrics cards", "Check total prospects count", "Verify New This Month calculation", "Check conversion rate percentage", "Verify active leads count"]',
  'All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors',
  '["Test with zero prospects", "test with very large numbers", "test with decimal calculations"]'
),

(
  'pro-ui-004',
  'Date Range Picker Functionality',
  'Prospects',
  'Medium',
  '["Click on date range picker", "Select different date ranges", "Choose custom date range", "Verify metrics update accordingly"]',
  'Date picker opens correctly, date selection works smoothly, metrics update based on selected range, custom date input accepts valid dates',
  '["Test with invalid dates", "test with future dates", "test with very old dates", "test with leap years"]'
),

-- Prospect Management Tests
(
  'pro-ui-005',
  'Add New Prospect Workflow',
  'Prospects',
  'High',
  '["Click Add New Prospect button", "Fill out the prospect form", "Test required field validation", "Submit the form", "Verify prospect appears in the list"]',
  'Form opens correctly, required fields show validation errors, form submits successfully, new prospect appears in table, success message displayed',
  '["Test with duplicate emails", "test with missing required fields", "test with special characters", "test with very long text"]'
),

(
  'pro-ui-006',
  'Edit Existing Prospect',
  'Prospects',
  'High',
  '["Find an existing prospect in the table", "Click Edit button", "Modify prospect information", "Save changes", "Verify updates are reflected"]',
  'Edit form opens with current data, changes saved successfully, updated information displays correctly, no data corruption occurs',
  '["Test with concurrent edits", "test with invalid data", "test with network interruption", "test with large text updates"]'
),

(
  'pro-ui-007',
  'Delete Prospect with Confirmation',
  'Prospects',
  'High',
  '["Select a prospect to delete", "Click Delete button", "Verify confirmation dialog appears", "Confirm deletion", "Check prospect is removed from list"]',
  'Confirmation dialog appears, prospect permanently deleted, table updates immediately, success message displayed',
  '["Test with multiple prospects selected", "test with network failure during deletion", "test with browser refresh during process"]'
),

(
  'pro-ui-008',
  'Convert Prospect to Client',
  'Prospects',
  'Medium',
  '["Select a qualified prospect", "Click Convert to Client button", "Fill out conversion form", "Complete conversion process", "Verify prospect status changes"]',
  'Conversion dialog opens, required fields validated, conversion completes successfully, prospect status updates to Converted',
  '["Test with incomplete prospect data", "test with validation errors", "test with network timeout", "test with duplicate client information"]'
),

-- Search & Filter Tests
(
  'pro-ui-009',
  'Text Search Functionality',
  'Prospects',
  'High',
  '["Enter search terms in search box", "Test partial name searches", "Test email searches", "Test phone number searches", "Verify search results accuracy"]',
  'Search results appear instantly, results match search criteria, no false positives, search highlights matching text',
  '["Test with no results", "test with special characters", "test with very long search terms", "test with SQL injection attempts"]'
),

(
  'pro-ui-010',
  'Filter by Brand',
  'Prospects',
  'Medium',
  '["Select different brands from filter dropdown", "Verify table updates accordingly", "Test All Brands option", "Check filter persistence"]',
  'Filter dropdown works correctly, table shows only matching prospects, filter selection persists, clear filter option works',
  '["Test with no brands available", "test with many brands", "test with brand names containing special characters", "test with concurrent filter changes"]'
),

(
  'pro-ui-011',
  'Filter by Status',
  'Prospects',
  'Medium',
  '["Filter by Active prospects", "Filter by Archived prospects", "Filter by Converted prospects", "Test multiple status selections"]',
  'Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate',
  '["Test with no prospects in status", "test with all statuses selected", "test with status changes during filtering", "test with very large result sets"]'
),

-- Table Interaction Tests
(
  'pro-ui-012',
  'Table Column Sorting',
  'Prospects',
  'Medium',
  '["Click on different column headers", "Verify ascending/descending order", "Test sort persistence", "Check sort indicators"]',
  'Clicking headers sorts data, sort direction toggles correctly, sort indicators visible, sort persists during navigation',
  '["Test with null values", "test with mixed data types", "test with special characters", "test with very long text"]'
),

(
  'pro-ui-013',
  'Table Pagination Controls',
  'Prospects',
  'Medium',
  '["Navigate through different pages", "Change items per page", "Test page size options", "Verify data consistency"]',
  'Page navigation works correctly, page size changes work, data remains consistent, page numbers are accurate',
  '["Test with very large datasets", "test with page size changes", "test with concurrent data updates", "test with network delays"]'
),

(
  'pro-ui-014',
  'Table Row Selection',
  'Prospects',
  'Medium',
  '["Select individual rows", "Select multiple rows", "Test select all functionality", "Verify selection state"]',
  'Individual row selection works, multiple row selection works, select all toggles correctly, selection state maintained',
  '["Test with no rows selected", "test with all rows selected", "test with selection during sorting", "test with selection during filtering"]'
),

-- Responsive Design Tests
(
  'pro-ui-015',
  'Desktop Layout (1920x1080)',
  'Prospects',
  'Medium',
  '["Set browser to 1920x1080 resolution", "Verify all elements visible", "Check table displays full columns", "Test horizontal scrolling if needed"]',
  'All UI elements fit properly, table shows maximum information, no horizontal scrolling needed, layout optimized for desktop',
  '["Test with different desktop resolutions", "test with browser zoom levels", "test with different font sizes", "test with high DPI displays"]'
),

(
  'pro-ui-016',
  'Tablet Layout (768x1024)',
  'Prospects',
  'Medium',
  '["Set browser to 768x1024 resolution", "Check responsive breakpoints", "Verify table adapts to width", "Test touch interactions"]',
  'Layout adapts to tablet size, touch targets appropriate, table columns stack if needed, navigation remains accessible',
  '["Test with different tablet orientations", "test with touch gestures", "test with virtual keyboard", "test with different tablet sizes"]'
),

(
  'pro-ui-017',
  'Mobile Layout (375x667)',
  'Prospects',
  'Medium',
  '["Set browser to 375x667 resolution", "Verify mobile-optimized layout", "Test touch interactions", "Check navigation menu"]',
  'Layout mobile-friendly, touch targets 44px minimum, navigation menu accessible, table adapts to mobile view',
  '["Test with different mobile sizes", "test with landscape orientation", "test with touch gestures", "test with virtual keyboard"]'
),

-- Accessibility Tests
(
  'pro-ui-018',
  'Keyboard Navigation',
  'Prospects',
  'High',
  '["Use Tab key to navigate", "Use Enter/Space to activate buttons", "Use arrow keys in tables", "Test escape key functionality"]',
  'All interactive elements reachable, focus indicators visible, keyboard shortcuts work, no keyboard traps',
  '["Test with screen reader", "test with keyboard-only navigation", "test with different keyboard layouts", "test with assistive technologies"]'
),

(
  'pro-ui-019',
  'Screen Reader Compatibility',
  'Prospects',
  'High',
  '["Enable screen reader software", "Navigate through interface", "Verify proper labeling", "Check semantic structure"]',
  'Screen reader announces elements correctly, form labels properly associated, table structure semantic, navigation logical',
  '["Test with different screen readers", "test with different languages", "test with complex data", "test with dynamic content"]'
),

(
  'pro-ui-020',
  'Color Contrast Validation',
  'Prospects',
  'Medium',
  '["Check text contrast ratios", "Verify button contrast", "Test link contrast", "Validate error message contrast"]',
  'Text meets WCAG AA standards, buttons sufficient contrast, links distinguishable, error messages readable',
  '["Test with color blindness simulators", "test with high contrast mode", "test with different color schemes", "test with low vision users"]'
),

-- Performance Tests
(
  'pro-ui-021',
  'Page Load Performance',
  'Prospects',
  'Medium',
  '["Measure initial page load time", "Test with different data volumes", "Monitor memory usage", "Check for memory leaks"]',
  'Page loads within 3 seconds, performance scales with data, no memory leaks detected, smooth scrolling performance',
  '["Test with very large datasets", "test with slow network", "test with limited memory", "test with concurrent users"]'
),

(
  'pro-ui-022',
  'Search Performance',
  'Prospects',
  'Medium',
  '["Test search with small datasets", "Test search with large datasets", "Measure search response time", "Verify search accuracy"]',
  'Search responds within 500ms, performance scales with data size, search results accurate, no performance degradation',
  '["Test with complex search queries", "test with real-time search", "test with search suggestions", "test with search history"]'
),

-- Error Handling Tests
(
  'pro-ui-023',
  'Network Error Handling',
  'Prospects',
  'High',
  '["Disconnect network connection", "Attempt to perform actions", "Reconnect network", "Verify recovery behavior"]',
  'Error messages displayed, retry options available, application recovers gracefully, user informed of issues',
  '["Test with intermittent connectivity", "test with slow network", "test with timeout scenarios", "test with server errors"]'
),

(
  'pro-ui-024',
  'Form Validation Errors',
  'Prospects',
  'High',
  '["Submit forms with invalid data", "Test required field validation", "Test format validation", "Verify error message clarity"]',
  'Validation errors clear, error messages helpful, form highlights problematic fields, user can correct errors easily',
  '["Test with all validation rules", "test with edge case data", "test with concurrent validation", "test with accessibility requirements"]'
),

-- Cross-Browser Compatibility Tests
(
  'pro-ui-025',
  'Chrome Browser Compatibility',
  'Prospects',
  'Medium',
  '["Test all features in Chrome", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions"]',
  'All features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Chrome versions", "test with Chrome extensions", "test with Chrome DevTools", "test with Chrome flags"]'
),

(
  'pro-ui-026',
  'Firefox Browser Compatibility',
  'Prospects',
  'Medium',
  '["Test all features in Firefox", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions"]',
  'All features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Firefox versions", "test with Firefox add-ons", "test with Firefox Developer Tools", "test with Firefox preferences"]'
),

(
  'pro-ui-027',
  'Safari Browser Compatibility',
  'Prospects',
  'Medium',
  '["Test all features in Safari", "Verify JavaScript functionality", "Check CSS rendering", "Test form submissions"]',
  'All features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully',
  '["Test with different Safari versions", "test with Safari Developer Tools", "test with Safari preferences", "test with Safari extensions"]'
),

-- Edge Case Tests
(
  'pro-ui-028',
  'Empty State Handling',
  'Prospects',
  'Medium',
  '["Test with no prospects data", "Test with empty search results", "Test with no filter matches", "Verify empty state messages"]',
  'Empty states display appropriate messages, no errors occur, user can still navigate, clear actions available',
  '["Test with loading states", "test with error states", "test with partial data", "test with data refresh"]'
),

(
  'pro-ui-029',
  'Large Dataset Performance',
  'Prospects',
  'Medium',
  '["Test with 1000+ prospects", "Test with complex filters", "Test with multiple searches", "Monitor performance metrics"]',
  'Performance remains acceptable, UI remains responsive, memory usage stable, user experience smooth',
  '["Test with maximum data limits", "test with concurrent operations", "test with data updates", "test with export operations"]'
),

(
  'pro-ui-030',
  'Concurrent User Testing',
  'Prospects',
  'Low',
  '["Test with multiple users accessing", "Test with simultaneous edits", "Test with concurrent searches", "Verify data consistency"]',
  'Data remains consistent, conflicts handled gracefully, performance acceptable, user experience maintained',
  '["Test with user permissions", "test with data locking", "test with conflict resolution", "test with audit trails"]'
);

-- Create indexes for better performance on new test cases
CREATE INDEX IF NOT EXISTS idx_qa_tests_prospects_ui ON qa_tests(category) WHERE category = 'Prospects';
CREATE INDEX IF NOT EXISTS idx_qa_tests_prospects_ui_priority ON qa_tests(priority, category) WHERE category = 'Prospects';

-- Add comments for documentation
COMMENT ON TABLE qa_tests IS 'Updated to include comprehensive Prospects testing scenarios';
COMMENT ON COLUMN qa_tests.category IS 'Test category including Prospects for UI testing scenarios';

-- Verify the insertion
SELECT 'Prospects Testing Guide test cases added successfully!' as status;
SELECT 'Total Prospects tests: ' || count(*) as test_count FROM qa_tests WHERE category = 'Prospects';
SELECT 'Test categories available: ' || string_agg(DISTINCT category, ', ') as categories FROM qa_tests;
