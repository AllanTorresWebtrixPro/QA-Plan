-- Settings Module - Travel Insurance Management Testing
-- Test cases for Travel Insurance CRUD operations and status management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Travel Insurance Management Test Cases
('TC-INS-001: Verify Insurance List Display', 'Settings', 'Travel Insurance', 'High', 
 '["1. Navigate to Settings", "2. Click on Travel Insurance section", "3. Verify insurance list loads and displays correctly"]', 
 'Insurance list should load and display all insurance options with proper formatting and data.', 
 '["Empty list", "Large number of insurance options"]', NOW(), NOW()),

('TC-INS-002: Verify Insurance Table Columns', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Navigate to Travel Insurance tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Insurance table should show columns: Name, Provider, Coverage, Price, Status.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-INS-003: Verify Insurance Search Functionality', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Navigate to Travel Insurance tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter insurance options based on entered search term (name, provider, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-INS-004: Verify Status Filter', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Navigate to Travel Insurance tab", "2. Select a status from filter dropdown", "3. Verify insurance options are filtered by status"]', 
 'Filter by status should show only insurance options with the selected status (Active, Inactive).', 
 '["Active options", "Inactive options", "All statuses option"]', NOW(), NOW()),

('TC-INS-005: Verify Empty State Display', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Navigate to Travel Insurance tab", "2. Clear all insurance options (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no insurance options exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-INS-006: Verify Loading Skeleton', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Navigate to Travel Insurance tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while insurance data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-INS-007: Verify Add Insurance Button', 'Settings', 'Travel Insurance', 'High', 
 '["1. Navigate to Travel Insurance tab", "2. Click Add Insurance button", "3. Verify dialog opens"]', 
 'Add Insurance button should open a dialog with insurance creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-INS-008: Verify Required Fields in Add Form', 'Settings', 'Travel Insurance', 'High', 
 '["1. Open Add Insurance dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Name*, Provider*, Coverage*, Price*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-INS-009: Verify Price Field Validation', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Open Add Insurance dialog", "2. Enter non-numeric value in price field", "3. Try to submit form", "4. Verify price validation"]', 
 'Price field should accept only numeric values and show error for invalid input.', 
 '["Decimal values", "Currency formatting", "Negative values"]', NOW(), NOW()),

('TC-INS-010: Verify Form Validation for Required Fields', 'Settings', 'Travel Insurance', 'High', 
 '["1. Open Add Insurance dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-INS-011: Verify Insurance Creation Success', 'Settings', 'Travel Insurance', 'High', 
 '["1. Open Add Insurance dialog", "2. Fill all required fields", "3. Submit form", "4. Verify insurance is created"]', 
 'Insurance option should be created successfully and appear in the insurance list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-INS-012: Verify Success Toast Notification', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Create a new insurance option", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after insurance creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-INS-013: Verify Dialog Close After Creation', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Create a new insurance option successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful insurance creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-INS-014: Verify New Insurance Appears in List', 'Settings', 'Travel Insurance', 'High', 
 '["1. Create a new insurance option", "2. Check insurance list", "3. Verify new insurance is visible"]', 
 'Newly created insurance option should appear in the insurance list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-INS-015: Verify Edit Insurance Button', 'Settings', 'Travel Insurance', 'High', 
 '["1. Navigate to Travel Insurance tab", "2. Click edit button on an insurance option", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled insurance data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-INS-016: Verify Pre-filled Data in Edit Form', 'Settings', 'Travel Insurance', 'High', 
 '["1. Open edit insurance dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current insurance data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-INS-017: Verify All Fields Editable', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Open edit insurance dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-INS-018: Verify Form Validation During Edit', 'Settings', 'Travel Insurance', 'High', 
 '["1. Open edit insurance dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-INS-019: Verify Insurance Update Success', 'Settings', 'Travel Insurance', 'High', 
 '["1. Edit insurance information", "2. Submit form", "3. Verify insurance is updated"]', 
 'Insurance option should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-INS-020: Verify Success Notification for Edit', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Update insurance information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful insurance update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-INS-021: Verify Changes Reflected in List', 'Settings', 'Travel Insurance', 'High', 
 '["1. Update insurance information", "2. Check insurance list", "3. Verify changes are visible"]', 
 'Updated insurance information should be reflected in the insurance list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-INS-022: Verify Delete Insurance Button', 'Settings', 'Travel Insurance', 'High', 
 '["1. Navigate to Travel Insurance tab", "2. Click delete button on an insurance option", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with insurance name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-INS-023: Verify Delete Confirmation Dialog', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify insurance name is displayed"]', 
 'Confirmation dialog should show insurance name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-INS-024: Verify Insurance Deletion Success', 'Settings', 'Travel Insurance', 'High', 
 '["1. Confirm insurance deletion", "2. Verify insurance is deleted", "3. Check insurance list"]', 
 'Insurance option should be deleted successfully and removed from the insurance list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-INS-025: Verify Success Notification for Delete', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Delete an insurance option", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful insurance deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-INS-026: Verify Insurance Removed from List', 'Settings', 'Travel Insurance', 'High', 
 '["1. Delete an insurance option", "2. Check insurance list", "3. Verify insurance is no longer visible"]', 
 'Deleted insurance option should be removed from the insurance list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-INS-027: Verify Status Toggle Button', 'Settings', 'Travel Insurance', 'High', 
 '["1. Navigate to Travel Insurance tab", "2. Click status toggle button on an insurance option", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-INS-028: Verify Status Change Confirmation Dialog', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-INS-029: Verify Insurance Status Update Success', 'Settings', 'Travel Insurance', 'High', 
 '["1. Confirm status change", "2. Verify insurance status updates", "3. Check insurance list"]', 
 'Insurance status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-INS-030: Verify Status Change Reflected in List', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Change insurance status", "2. Check insurance list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the insurance list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-INS-031: Verify Error Handling for API Failures', 'Settings', 'Travel Insurance', 'High', 
 '["1. Simulate API failure", "2. Perform insurance operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-INS-032: Verify Network Error Handling', 'Settings', 'Travel Insurance', 'Medium', 
 '["1. Disconnect network", "2. Try to perform insurance operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
