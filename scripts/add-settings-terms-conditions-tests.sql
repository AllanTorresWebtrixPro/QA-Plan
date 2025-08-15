-- Settings Module - Terms & Conditions Management Testing
-- Test cases for Terms & Conditions CRUD operations, status management, and preview functionality

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Terms & Conditions Management Test Cases
('TC-TERM-001: Verify Terms List Display', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Navigate to Settings", "2. Click on Terms & Conditions section", "3. Verify terms list loads and displays correctly"]', 
 'Terms list should load and display all terms with proper formatting and data.', 
 '["Empty list", "Large number of terms"]', NOW(), NOW()),

('TC-TERM-002: Verify Terms Table Columns', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Navigate to Terms & Conditions tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Terms table should show columns: Title, Brand, Status, Last Updated, Actions.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-TERM-003: Verify Terms Search Functionality', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Navigate to Terms & Conditions tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter terms based on entered search term (title, brand, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-TERM-004: Verify Brand Filter', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Navigate to Terms & Conditions tab", "2. Select a brand from filter dropdown", "3. Verify terms are filtered by brand"]', 
 'Filter by brand should show only terms belonging to the selected brand.', 
 '["Multiple brands", "No terms for brand", "All brands option"]', NOW(), NOW()),

('TC-TERM-005: Verify Status Filter', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Navigate to Terms & Conditions tab", "2. Select a status from filter dropdown", "3. Verify terms are filtered by status"]', 
 'Filter by status should show only terms with the selected status (Active, Inactive).', 
 '["Active terms", "Inactive terms", "All statuses option"]', NOW(), NOW()),

('TC-TERM-006: Verify Empty State Display', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Navigate to Terms & Conditions tab", "2. Clear all terms (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no terms exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-TERM-007: Verify Loading Skeleton', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Navigate to Terms & Conditions tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while terms data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-TERM-008: Verify Add Terms Button', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Navigate to Terms & Conditions tab", "2. Click Add Terms button", "3. Verify dialog opens"]', 
 'Add Terms button should open a dialog with terms creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-TERM-009: Verify Required Fields in Add Form', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Open Add Terms dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Title*, Brand*, Content*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-TERM-010: Verify Brand Selection Dropdown', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Open Add Terms dialog", "2. Check brand selection dropdown", "3. Verify all brands are listed"]', 
 'Brand selection dropdown should list all available brands for terms assignment.', 
 '["No brands available", "Many brands", "Brand names"]', NOW(), NOW()),

('TC-TERM-011: Verify Rich Text Editor', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Open Add Terms dialog", "2. Check content field", "3. Verify rich text editor works"]', 
 'Content field should have rich text editor with formatting options.', 
 '["Text formatting", "HTML content", "Editor toolbar"]', NOW(), NOW()),

('TC-TERM-012: Verify Form Validation for Required Fields', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Open Add Terms dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-TERM-013: Verify Terms Creation Success', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Open Add Terms dialog", "2. Fill all required fields", "3. Submit form", "4. Verify terms are created"]', 
 'Terms should be created successfully and appear in the terms list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-TERM-014: Verify Success Toast Notification', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Create new terms", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after terms creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-TERM-015: Verify Dialog Close After Creation', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Create new terms successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful terms creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-TERM-016: Verify New Terms Appear in List', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Create new terms", "2. Check terms list", "3. Verify new terms are visible"]', 
 'Newly created terms should appear in the terms list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-TERM-017: Verify Edit Terms Button', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Navigate to Terms & Conditions tab", "2. Click edit button on terms", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled terms data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-TERM-018: Verify Pre-filled Data in Edit Form', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Open edit terms dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current terms data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-TERM-019: Verify Rich Text Editor Loads Content', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Open edit terms dialog", "2. Check rich text editor", "3. Verify existing content loads"]', 
 'Rich text editor should load existing content with proper formatting.', 
 '["Content formatting", "HTML preservation", "Editor state"]', NOW(), NOW()),

('TC-TERM-020: Verify All Fields Editable', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Open edit terms dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-TERM-021: Verify Form Validation During Edit', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Open edit terms dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-TERM-022: Verify Terms Update Success', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Edit terms information", "2. Submit form", "3. Verify terms are updated"]', 
 'Terms should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-TERM-023: Verify Success Notification for Edit', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Update terms information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful terms update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-TERM-024: Verify Changes Reflected in List', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Update terms information", "2. Check terms list", "3. Verify changes are visible"]', 
 'Updated terms information should be reflected in the terms list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-TERM-025: Verify Delete Terms Button', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Navigate to Terms & Conditions tab", "2. Click delete button on terms", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with terms title.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-TERM-026: Verify Delete Confirmation Dialog', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify terms title is displayed"]', 
 'Confirmation dialog should show terms title and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-TERM-027: Verify Terms Deletion Success', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Confirm terms deletion", "2. Verify terms are deleted", "3. Check terms list"]', 
 'Terms should be deleted successfully and removed from the terms list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-TERM-028: Verify Success Notification for Delete', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Delete terms", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful terms deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-TERM-029: Verify Terms Removed from List', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Delete terms", "2. Check terms list", "3. Verify terms are no longer visible"]', 
 'Deleted terms should be removed from the terms list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-TERM-030: Verify Status Toggle Button', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Navigate to Terms & Conditions tab", "2. Click status toggle button on terms", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-TERM-031: Verify Status Change Confirmation Dialog', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-TERM-032: Verify Terms Status Update Success', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Confirm status change", "2. Verify terms status updates", "3. Check terms list"]', 
 'Terms status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-TERM-033: Verify Status Change Reflected in List', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Change terms status", "2. Check terms list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the terms list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Preview Terms Test Cases
('TC-TERM-034: Verify Preview Button', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Navigate to Terms & Conditions tab", "2. Click preview button on terms", "3. Verify preview opens"]', 
 'Preview button should open terms in new tab/window or preview dialog.', 
 '["Preview method", "Button state"]', NOW(), NOW()),

('TC-TERM-035: Verify Terms Display in Preview', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Open terms preview", "2. Check terms content", "3. Verify terms display correctly"]', 
 'Terms should display correctly in preview with proper formatting.', 
 '["Content formatting", "Layout", "Readability"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-TERM-036: Verify Error Handling for API Failures', 'Settings', 'Terms & Conditions', 'High', 
 '["1. Simulate API failure", "2. Perform terms operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-TERM-037: Verify Form Validation Error Display', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-TERM-038: Verify Network Error Handling', 'Settings', 'Terms & Conditions', 'Medium', 
 '["1. Disconnect network", "2. Try to perform terms operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
