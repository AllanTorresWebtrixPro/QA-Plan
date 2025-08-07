-- Settings Module - Payment Methods Management Testing
-- Test cases for Payment Methods CRUD operations and status management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Payment Methods Management Test Cases
('TC-PAY-001: Verify Payment Methods List Display', 'Settings', 'Payment Methods', 'High', 
 '["1. Navigate to Settings", "2. Click on Payment Methods section", "3. Verify payment methods list loads and displays correctly"]', 
 'Payment methods list should load and display all payment methods with proper formatting and data.', 
 '["Empty list", "Large number of payment methods"]', NOW(), NOW()),

('TC-PAY-002: Verify Payment Methods Table Columns', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Navigate to Payment Methods tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Payment methods table should show columns: Name, Type, Status, Actions.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-PAY-003: Verify Payment Methods Search Functionality', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Navigate to Payment Methods tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter payment methods based on entered search term (name, type, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-PAY-004: Verify Status Filter', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Navigate to Payment Methods tab", "2. Select a status from filter dropdown", "3. Verify payment methods are filtered by status"]', 
 'Filter by status should show only payment methods with the selected status (Active, Inactive).', 
 '["Active methods", "Inactive methods", "All statuses option"]', NOW(), NOW()),

('TC-PAY-005: Verify Empty State Display', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Navigate to Payment Methods tab", "2. Clear all payment methods (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no payment methods exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-PAY-006: Verify Loading Skeleton', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Navigate to Payment Methods tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while payment methods data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-PAY-007: Verify Add Payment Method Button', 'Settings', 'Payment Methods', 'High', 
 '["1. Navigate to Payment Methods tab", "2. Click Add Payment Method button", "3. Verify dialog opens"]', 
 'Add Payment Method button should open a dialog with payment method creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-PAY-008: Verify Required Fields in Add Form', 'Settings', 'Payment Methods', 'High', 
 '["1. Open Add Payment Method dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Name*, Type*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-PAY-009: Verify Payment Method Types', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Open Add Payment Method dialog", "2. Check payment method type dropdown", "3. Verify types are correct"]', 
 'Payment method types should include: Credit Card, Bank Transfer, Cash, Check, etc.', 
 '["Type selection", "Default selection"]', NOW(), NOW()),

('TC-PAY-010: Verify Form Validation for Required Fields', 'Settings', 'Payment Methods', 'High', 
 '["1. Open Add Payment Method dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-PAY-011: Verify Payment Method Creation Success', 'Settings', 'Payment Methods', 'High', 
 '["1. Open Add Payment Method dialog", "2. Fill all required fields", "3. Submit form", "4. Verify payment method is created"]', 
 'Payment method should be created successfully and appear in the payment methods list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-PAY-012: Verify Success Toast Notification', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Create a new payment method", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after payment method creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-PAY-013: Verify Dialog Close After Creation', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Create a new payment method successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful payment method creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-PAY-014: Verify New Payment Method Appears in List', 'Settings', 'Payment Methods', 'High', 
 '["1. Create a new payment method", "2. Check payment methods list", "3. Verify new payment method is visible"]', 
 'Newly created payment method should appear in the payment methods list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-PAY-015: Verify Edit Payment Method Button', 'Settings', 'Payment Methods', 'High', 
 '["1. Navigate to Payment Methods tab", "2. Click edit button on a payment method", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled payment method data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-PAY-016: Verify Pre-filled Data in Edit Form', 'Settings', 'Payment Methods', 'High', 
 '["1. Open edit payment method dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current payment method data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-PAY-017: Verify All Fields Editable', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Open edit payment method dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-PAY-018: Verify Form Validation During Edit', 'Settings', 'Payment Methods', 'High', 
 '["1. Open edit payment method dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-PAY-019: Verify Payment Method Update Success', 'Settings', 'Payment Methods', 'High', 
 '["1. Edit payment method information", "2. Submit form", "3. Verify payment method is updated"]', 
 'Payment method should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-PAY-020: Verify Success Notification for Edit', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Update payment method information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful payment method update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-PAY-021: Verify Changes Reflected in List', 'Settings', 'Payment Methods', 'High', 
 '["1. Update payment method information", "2. Check payment methods list", "3. Verify changes are visible"]', 
 'Updated payment method information should be reflected in the payment methods list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-PAY-022: Verify Delete Payment Method Button', 'Settings', 'Payment Methods', 'High', 
 '["1. Navigate to Payment Methods tab", "2. Click delete button on a payment method", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with payment method name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-PAY-023: Verify Delete Confirmation Dialog', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify payment method name is displayed"]', 
 'Confirmation dialog should show payment method name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-PAY-024: Verify Payment Method Deletion Success', 'Settings', 'Payment Methods', 'High', 
 '["1. Confirm payment method deletion", "2. Verify payment method is deleted", "3. Check payment methods list"]', 
 'Payment method should be deleted successfully and removed from the payment methods list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-PAY-025: Verify Success Notification for Delete', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Delete a payment method", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful payment method deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-PAY-026: Verify Payment Method Removed from List', 'Settings', 'Payment Methods', 'High', 
 '["1. Delete a payment method", "2. Check payment methods list", "3. Verify payment method is no longer visible"]', 
 'Deleted payment method should be removed from the payment methods list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-PAY-027: Verify Status Toggle Button', 'Settings', 'Payment Methods', 'High', 
 '["1. Navigate to Payment Methods tab", "2. Click status toggle button on a payment method", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-PAY-028: Verify Status Change Confirmation Dialog', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-PAY-029: Verify Payment Method Status Update Success', 'Settings', 'Payment Methods', 'High', 
 '["1. Confirm status change", "2. Verify payment method status updates", "3. Check payment methods list"]', 
 'Payment method status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-PAY-030: Verify Status Change Reflected in List', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Change payment method status", "2. Check payment methods list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the payment methods list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-PAY-031: Verify Error Handling for API Failures', 'Settings', 'Payment Methods', 'High', 
 '["1. Simulate API failure", "2. Perform payment method operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-PAY-032: Verify Form Validation Error Display', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-PAY-033: Verify Network Error Handling', 'Settings', 'Payment Methods', 'Medium', 
 '["1. Disconnect network", "2. Try to perform payment method operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
