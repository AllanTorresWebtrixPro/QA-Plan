-- Settings Module - Invoice Items Management Testing
-- Test cases for Invoice Items CRUD operations, group management, and status management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Invoice Items Management Test Cases
('TC-INV-001: Verify Invoice Items List Display', 'Settings', 'Invoice Items', 'High', 
 '["1. Navigate to Settings", "2. Click on Invoice Items section", "3. Verify invoice items list loads and displays correctly"]', 
 'Invoice items list should load and display all items with proper formatting and data.', 
 '["Empty list", "Large number of items"]', NOW(), NOW()),

('TC-INV-002: Verify Items Grouped by Label', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Check item grouping", "3. Verify items are grouped by label correctly"]', 
 'Invoice items should be grouped by their labels with clear group headers.', 
 '["Multiple groups", "Single group", "No groups"]', NOW(), NOW()),

('TC-INV-003: Verify Expandable/Collapsible Groups', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Click on group headers", "3. Verify groups expand and collapse"]', 
 'Group headers should be clickable and allow expanding/collapsing of item groups.', 
 '["Group state persistence", "Animation smoothness"]', NOW(), NOW()),

('TC-INV-004: Verify Invoice Items Search Functionality', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter invoice items based on entered search term (name, label, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-INV-005: Verify Empty State Display', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Clear all items (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no invoice items exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-INV-006: Verify Loading Skeleton', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while invoice items data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-INV-007: Verify Add Item Button', 'Settings', 'Invoice Items', 'High', 
 '["1. Navigate to Invoice Items tab", "2. Click Add Item button", "3. Verify dialog opens"]', 
 'Add Item button should open a dialog with invoice item creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-INV-008: Verify Required Fields in Add Form', 'Settings', 'Invoice Items', 'High', 
 '["1. Open Add Item dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Label*, Name*, Price*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-INV-009: Verify Price Field Validation', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Open Add Item dialog", "2. Enter non-numeric value in price field", "3. Try to submit form", "4. Verify price validation"]', 
 'Price field should accept only numeric values and show error for invalid input.', 
 '["Decimal values", "Currency formatting", "Negative values"]', NOW(), NOW()),

('TC-INV-010: Verify Form Validation for Required Fields', 'Settings', 'Invoice Items', 'High', 
 '["1. Open Add Item dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-INV-011: Verify Invoice Item Creation Success', 'Settings', 'Invoice Items', 'High', 
 '["1. Open Add Item dialog", "2. Fill all required fields", "3. Submit form", "4. Verify item is created"]', 
 'Invoice item should be created successfully and appear in the correct group.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-INV-012: Verify Success Toast Notification', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Create a new invoice item", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after item creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-INV-013: Verify Dialog Close After Creation', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Create a new invoice item successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful item creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-INV-014: Verify New Item Appears in Correct Group', 'Settings', 'Invoice Items', 'High', 
 '["1. Create a new invoice item", "2. Check items list", "3. Verify new item appears in correct group"]', 
 'Newly created invoice item should appear in the correct group based on its label.', 
 '["Group assignment", "Sorting order"]', NOW(), NOW()),

('TC-INV-015: Verify Edit Item Button', 'Settings', 'Invoice Items', 'High', 
 '["1. Navigate to Invoice Items tab", "2. Click edit button on an item", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled item data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-INV-016: Verify Pre-filled Data in Edit Form', 'Settings', 'Invoice Items', 'High', 
 '["1. Open edit item dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current item data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-INV-017: Verify All Fields Editable', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Open edit item dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-INV-018: Verify Form Validation During Edit', 'Settings', 'Invoice Items', 'High', 
 '["1. Open edit item dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-INV-019: Verify Invoice Item Update Success', 'Settings', 'Invoice Items', 'High', 
 '["1. Edit item information", "2. Submit form", "3. Verify item is updated"]', 
 'Invoice item should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-INV-020: Verify Success Notification for Edit', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Update item information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful item update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-INV-021: Verify Changes Reflected in List', 'Settings', 'Invoice Items', 'High', 
 '["1. Update item information", "2. Check items list", "3. Verify changes are visible"]', 
 'Updated item information should be reflected in the items list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-INV-022: Verify Delete Item Button', 'Settings', 'Invoice Items', 'High', 
 '["1. Navigate to Invoice Items tab", "2. Click delete button on an item", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with item name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-INV-023: Verify Delete Confirmation Dialog', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify item name is displayed"]', 
 'Confirmation dialog should show item name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-INV-024: Verify Invoice Item Deletion Success', 'Settings', 'Invoice Items', 'High', 
 '["1. Confirm item deletion", "2. Verify item is deleted", "3. Check items list"]', 
 'Invoice item should be deleted successfully and removed from the items list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-INV-025: Verify Success Notification for Delete', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Delete an invoice item", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful item deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-INV-026: Verify Item Removed from List', 'Settings', 'Invoice Items', 'High', 
 '["1. Delete an invoice item", "2. Check items list", "3. Verify item is no longer visible"]', 
 'Deleted item should be removed from the items list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-INV-027: Verify Status Toggle Button', 'Settings', 'Invoice Items', 'High', 
 '["1. Navigate to Invoice Items tab", "2. Click status toggle button on an item", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-INV-028: Verify Status Change Confirmation Dialog', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-INV-029: Verify Item Status Update Success', 'Settings', 'Invoice Items', 'High', 
 '["1. Confirm status change", "2. Verify item status updates", "3. Check items list"]', 
 'Item status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-INV-030: Verify Status Change Reflected in List', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Change item status", "2. Check items list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the items list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Group Management Test Cases
('TC-INV-031: Verify Groups Can Be Expanded/Collapsed', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Click on group headers", "3. Verify expand/collapse functionality"]', 
 'Group headers should allow expanding and collapsing of item groups.', 
 '["Group state", "Animation", "Multiple groups"]', NOW(), NOW()),

('TC-INV-032: Verify Items Properly Grouped by Label', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Check item grouping", "3. Verify items are in correct groups"]', 
 'Items should be properly grouped by their labels with correct group assignment.', 
 '["Group accuracy", "Item placement"]', NOW(), NOW()),

('TC-INV-033: Verify Group Headers Show Correct Counts', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Navigate to Invoice Items tab", "2. Check group headers", "3. Verify counts are accurate"]', 
 'Group headers should display accurate counts of items in each group.', 
 '["Count accuracy", "Real-time updates"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-INV-034: Verify Error Handling for API Failures', 'Settings', 'Invoice Items', 'High', 
 '["1. Simulate API failure", "2. Perform item operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-INV-035: Verify Form Validation Error Display', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-INV-036: Verify Network Error Handling', 'Settings', 'Invoice Items', 'Medium', 
 '["1. Disconnect network", "2. Try to perform item operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
