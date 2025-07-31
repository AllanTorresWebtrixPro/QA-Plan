-- Add comprehensive Current Trips test cases to the QA database

INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  -- Current Trips Dashboard
  (
    'ct-001',
    'Current Trips Dashboard Display',
    'Current Trips',
    'High',
    '["Navigate to the current trips page", "Verify page title and description", "Check that the dashboard loads without errors", "Verify all UI elements are present"]',
    'Dashboard displays correctly with all UI elements and loads without errors',
    '["Test with no trips", "many trips", "slow network connections"]'
  ),
  (
    'ct-002',
    'Current Trips Search and Filtering',
    'Current Trips',
    'High',
    '["Enter search terms in the search box", "Verify filtered results display correctly", "Test search by leader, client, lodge", "Clear search and verify reset"]',
    'Search filters trips correctly by leader, client, lodge, and other criteria',
    '["Test with empty results", "special characters", "very long search terms"]'
  ),
  (
    'ct-003',
    'Current Trips Table Columns',
    'Current Trips',
    'High',
    '["Verify all table columns display correctly", "Check column headers and data alignment", "Test responsive behavior on different screen sizes", "Verify data formatting"]',
    'Table shows all required columns with correct data and proper formatting',
    '["Test with missing data", "very long text", "special characters in data"]'
  ),
  (
    'ct-004',
    'Current Trips Row Expansion',
    'Current Trips',
    'High',
    '["Click expand/collapse button on a trip row", "Verify lodge details are shown/hidden", "Test multiple row expansions", "Check expansion state persistence"]',
    'Row expands/collapses correctly to show/hide lodge details',
    '["Test with trips having many lodges", "trips with no lodges", "concurrent expansions"]'
  ),
  (
    'ct-005',
    'Current Trips Actions',
    'Current Trips',
    'High',
    '["Click View Pre-Trip button", "Click Create Invoice button", "Click View Client Profile button", "Click View Survey button", "Verify each action works correctly"]',
    'Each action navigates or opens the correct dialog/page with proper functionality',
    '["Test with missing permissions", "invalid trip IDs", "network interruptions"]'
  ),
  (
    'ct-006',
    'Create Invoice from Current Trip',
    'Current Trips',
    'High',
    '["Click Create Invoice on a lodge row", "Fill invoice form with required data", "Submit invoice", "Verify invoice creation and association"]',
    'Invoice is created successfully and associated with the correct trip/lodge',
    '["Test with invalid form data", "network errors", "duplicate invoice creation"]'
  ),
  (
    'ct-007',
    'Current Trips Date Formatting',
    'Current Trips',
    'Medium',
    '["Check all date fields (arrival, departure, birth date)", "Verify Month Day, Year format consistency", "Test date sorting", "Check date display across different locales"]',
    'All dates display in consistent Month Day, Year format',
    '["Test with null dates", "invalid dates", "future dates", "very old dates"]'
  ),
  (
    'ct-008',
    'Current Trips Survey Status Badges',
    'Current Trips',
    'Medium',
    '["Check survey status badge for each lodge", "Verify badge color coding", "Check badge text accuracy", "Test different survey statuses"]',
    'Badge displays correct status with appropriate color coding',
    '["Test with unknown status", "missing survey data", "status transitions"]'
  ),
  (
    'ct-009',
    'Current Trips Empty State Handling',
    'Current Trips',
    'Medium',
    '["Navigate to current trips with no active trips", "Verify empty state message displays", "Check empty state UI elements", "Test search with no results"]',
    'User sees a helpful message and appropriate UI when no trips are found',
    '["Test with filtered empty results", "loading states", "error states"]'
  ),

  -- Additional Current Trips Functionality
  (
    'ct-010',
    'Current Trips Sorting Functionality',
    'Current Trips',
    'Medium',
    '["Click column headers to sort", "Test ascending/descending order", "Sort by different columns (dates, names, status)", "Verify sort indicators"]',
    'All sortable columns work correctly with proper sort indicators',
    '["Test sorting with null values", "identical values", "mixed data types"]'
  ),
  (
    'ct-011',
    'Current Trips Pagination',
    'Current Trips',
    'Medium',
    '["Navigate through multiple pages of trips", "Test page size options", "Verify page navigation controls", "Check total count accuracy"]',
    'Pagination works correctly with accurate page counts and navigation',
    '["Test with exactly one page", "very large datasets", "page size changes"]'
  ),
  (
    'ct-012',
    'Current Trips Data Refresh',
    'Current Trips',
    'Medium',
    '["Use refresh functionality", "Verify data updates", "Test auto-refresh if available", "Check loading states during refresh"]',
    'Data refreshes correctly and shows updated information',
    '["Test with network interruptions", "concurrent data changes", "refresh failures"]'
  ),
  (
    'ct-013',
    'Current Trips Client Information Display',
    'Current Trips',
    'Medium',
    '["Verify client name display", "Check client contact information", "Test client profile links", "Verify client data consistency"]',
    'Client information displays correctly with proper formatting and links',
    '["Test with missing client data", "very long client names", "special characters"]'
  ),
  (
    'ct-014',
    'Current Trips Lodge Information Display',
    'Current Trips',
    'High',
    '["Verify lodge details in expanded rows", "Check lodge contact information", "Test lodge-specific actions", "Verify lodge data accuracy"]',
    'Lodge information displays correctly with all relevant details',
    '["Test with incomplete lodge data", "lodges with special characters", "many lodges per trip"]'
  ),
  (
    'ct-015',
    'Current Trips Status Management',
    'Current Trips',
    'High',
    '["Check trip status display", "Verify status color coding", "Test status filtering", "Check status transitions"]',
    'Trip statuses display correctly with appropriate visual indicators',
    '["Test with undefined statuses", "status change scenarios", "bulk status updates"]'
  ),
  (
    'ct-016',
    'Current Trips Export Functionality',
    'Current Trips',
    'Medium',
    '["Test export to CSV/Excel", "Verify exported data accuracy", "Check export file formatting", "Test export with filters applied"]',
    'Export functionality works correctly with accurate data and proper formatting',
    '["Test with large datasets", "special characters in data", "export failures"]'
  ),
  (
    'ct-017',
    'Current Trips Bulk Actions',
    'Current Trips',
    'Medium',
    '["Select multiple trips", "Test bulk operations", "Verify bulk action confirmations", "Check bulk operation results"]',
    'Bulk actions work correctly with proper confirmations and error handling',
    '["Test with mixed trip statuses", "large selections", "operation failures"]'
  ),
  (
    'ct-018',
    'Current Trips Mobile Responsiveness',
    'Current Trips',
    'Medium',
    '["Test on mobile devices", "Verify responsive table behavior", "Check touch interactions", "Test mobile-specific features"]',
    'Current trips interface works well on mobile with appropriate responsive behavior',
    '["Test with different screen sizes", "orientations", "touch gestures"]'
  ),
  (
    'ct-019',
    'Current Trips Performance Testing',
    'Current Trips',
    'Medium',
    '["Test with large datasets", "Measure page load times", "Test scrolling performance", "Verify memory usage"]',
    'Page performs well with large datasets and maintains good user experience',
    '["Test with maximum trip limits", "concurrent user access", "resource constraints"]'
  ),
  (
    'ct-020',
    'Current Trips Error Handling',
    'Current Trips',
    'Medium',
    '["Test with network errors", "Simulate API failures", "Test with corrupted data", "Verify error messages"]',
    'Appropriate error messages display and system handles errors gracefully',
    '["Test with partial data loads", "timeout scenarios", "invalid responses"]'
  ),

  -- Current Trips Integration Tests
  (
    'ct-021',
    'Current Trips Pre-Trip Integration',
    'Current Trips',
    'High',
    '["Navigate from current trip to pre-trip", "Verify data consistency", "Test pre-trip actions from current trips", "Check data synchronization"]',
    'Pre-trip integration works correctly with consistent data flow',
    '["Test with missing pre-trip data", "data conflicts", "concurrent modifications"]'
  ),
  (
    'ct-022',
    'Current Trips Invoice Integration',
    'Current Trips',
    'High',
    '["Create invoice from current trip", "Verify invoice data population", "Test invoice-trip association", "Check invoice status updates"]',
    'Invoice integration works correctly with proper data association',
    '["Test with existing invoices", "invoice creation failures", "data inconsistencies"]'
  ),
  (
    'ct-023',
    'Current Trips Survey Integration',
    'Current Trips',
    'High',
    '["Access surveys from current trips", "Verify survey status accuracy", "Test survey completion workflow", "Check survey data integration"]',
    'Survey integration works correctly with accurate status and data flow',
    '["Test with incomplete surveys", "survey assignment issues", "status sync problems"]'
  ),
  (
    'ct-024',
    'Current Trips Client Profile Integration',
    'Current Trips',
    'Medium',
    '["Navigate to client profile from current trip", "Verify client data consistency", "Test client profile updates", "Check data synchronization"]',
    'Client profile integration maintains data consistency and proper navigation',
    '["Test with missing client data", "profile update conflicts", "navigation errors"]'
  ),
  (
    'ct-025',
    'Current Trips Notification System',
    'Current Trips',
    'Medium',
    '["Test trip-related notifications", "Verify notification triggers", "Check notification content", "Test notification actions"]',
    'Notification system works correctly for trip-related events',
    '["Test with notification failures", "duplicate notifications", "timing issues"]'
  ),

  -- Current Trips Advanced Features
  (
    'ct-026',
    'Current Trips Advanced Search',
    'Current Trips',
    'Medium',
    '["Use advanced search filters", "Combine multiple search criteria", "Test date range searches", "Verify complex filter combinations"]',
    'Advanced search functionality works correctly with multiple criteria',
    '["Test with conflicting filters", "very specific searches", "filter combinations with no results"]'
  ),
  (
    'ct-027',
    'Current Trips Favorites/Bookmarks',
    'Current Trips',
    'Low',
    '["Add trips to favorites", "Remove from favorites", "Filter by favorites", "Test favorites persistence"]',
    'Favorites functionality works correctly with proper persistence',
    '["Test with many favorites", "favorites sync issues", "storage limitations"]'
  ),
  (
    'ct-028',
    'Current Trips Print Functionality',
    'Current Trips',
    'Low',
    '["Generate printable trip list", "Verify print layout", "Test print with filters", "Check print formatting"]',
    'Print functionality works correctly with proper formatting',
    '["Test with large trip lists", "special characters", "print failures"]'
  ),
  (
    'ct-029',
    'Current Trips Audit Trail',
    'Current Trips',
    'Medium',
    '["Check trip modification history", "Verify audit log entries", "Test audit trail accuracy", "Check user attribution"]',
    'Audit trail captures all trip-related changes with proper attribution',
    '["Test with concurrent modifications", "system changes", "audit log failures"]'
  ),
  (
    'ct-030',
    'Current Trips Data Validation',
    'Current Trips',
    'High',
    '["Test data integrity checks", "Verify required field validation", "Test data format validation", "Check business rule enforcement"]',
    'Data validation works correctly and enforces business rules',
    '["Test with edge case data", "validation bypass attempts", "conflicting business rules"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the current trips test cases were added
SELECT 'Current Trips test cases added successfully!' as status;
SELECT 'Current Trips tests added: ' || count(*) as current_trips_test_count FROM qa_tests WHERE category = 'Current Trips';
SELECT 'Total tests now: ' || count(*) as total_test_count FROM qa_tests;
