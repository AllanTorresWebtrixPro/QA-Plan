-- Settings Module - Email Notifications Management Testing
-- Test cases for Email Notifications CRUD operations, configuration, and status management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Email Notifications Management Test Cases
('TC-NOTIF-001: Verify Notifications List Display', 'Settings', 'Email Notifications', 'High', 
 '["1. Navigate to Settings", "2. Click on Email Notifications section", "3. Verify notifications list loads and displays correctly"]', 
 'Notifications list should load and display all email notifications with proper formatting and data.', 
 '["Empty list", "Large number of notifications"]', NOW(), NOW()),

('TC-NOTIF-002: Verify Notifications Table Columns', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Navigate to Email Notifications tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Notifications table should show columns: Name, Type, Brand, Status, Recipients, Actions.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-NOTIF-003: Verify Notifications Search Functionality', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Navigate to Email Notifications tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter notifications based on entered search term (name, type, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-NOTIF-004: Verify Type Filter', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Navigate to Email Notifications tab", "2. Select a type from filter dropdown", "3. Verify notifications are filtered by type"]', 
 'Filter by type should show only notifications with the selected type.', 
 '["Multiple types", "No notifications for type", "All types option"]', NOW(), NOW()),

('TC-NOTIF-005: Verify Brand Filter', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Navigate to Email Notifications tab", "2. Select a brand from filter dropdown", "3. Verify notifications are filtered by brand"]', 
 'Filter by brand should show only notifications belonging to the selected brand.', 
 '["Multiple brands", "No notifications for brand", "All brands option"]', NOW(), NOW()),

('TC-NOTIF-006: Verify Status Filter', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Navigate to Email Notifications tab", "2. Select a status from filter dropdown", "3. Verify notifications are filtered by status"]', 
 'Filter by status should show only notifications with the selected status (Active, Inactive).', 
 '["Active notifications", "Inactive notifications", "All statuses option"]', NOW(), NOW()),

('TC-NOTIF-007: Verify Empty State Display', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Navigate to Email Notifications tab", "2. Clear all notifications (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no notifications exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-NOTIF-008: Verify Loading Skeleton', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Navigate to Email Notifications tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while notifications data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-NOTIF-009: Verify Add Notification Button', 'Settings', 'Email Notifications', 'High', 
 '["1. Navigate to Email Notifications tab", "2. Click Add Notification button", "3. Verify dialog opens"]', 
 'Add Notification button should open a dialog with notification creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-NOTIF-010: Verify Required Fields in Add Form', 'Settings', 'Email Notifications', 'High', 
 '["1. Open Add Notification dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Name*, Type*, Brand*, Template*, Recipients*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-NOTIF-011: Verify Type Selection Dropdown', 'Settings', 'Email Notifications', 'High', 
 '["1. Open Add Notification dialog", "2. Check type selection dropdown", "3. Verify types are listed"]', 
 'Type selection dropdown should list available notification types.', 
 '["Notification types", "Default selection"]', NOW(), NOW()),

('TC-NOTIF-012: Verify Brand Selection Dropdown', 'Settings', 'Email Notifications', 'High', 
 '["1. Open Add Notification dialog", "2. Check brand selection dropdown", "3. Verify all brands are listed"]', 
 'Brand selection dropdown should list all available brands for notification assignment.', 
 '["No brands available", "Many brands", "Brand names"]', NOW(), NOW()),

('TC-NOTIF-013: Verify Template Selection Dropdown', 'Settings', 'Email Notifications', 'High', 
 '["1. Open Add Notification dialog", "2. Check template selection dropdown", "3. Verify templates are listed"]', 
 'Template selection dropdown should list available email templates for the selected brand.', 
 '["Template filtering", "Brand-specific templates"]', NOW(), NOW()),

('TC-NOTIF-014: Verify Recipients Configuration', 'Settings', 'Email Notifications', 'High', 
 '["1. Open Add Notification dialog", "2. Check recipients field", "3. Verify recipients can be configured"]', 
 'Recipients field should allow configuration of notification recipients.', 
 '["Email addresses", "User groups", "Dynamic recipients"]', NOW(), NOW()),

('TC-NOTIF-015: Verify Form Validation for Required Fields', 'Settings', 'Email Notifications', 'High', 
 '["1. Open Add Notification dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-NOTIF-016: Verify Notification Creation Success', 'Settings', 'Email Notifications', 'High', 
 '["1. Open Add Notification dialog", "2. Fill all required fields", "3. Submit form", "4. Verify notification is created"]', 
 'Notification should be created successfully and appear in the notifications list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-NOTIF-017: Verify Success Toast Notification', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Create a new notification", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after notification creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-NOTIF-018: Verify Dialog Close After Creation', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Create a new notification successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful notification creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-NOTIF-019: Verify New Notification Appears in List', 'Settings', 'Email Notifications', 'High', 
 '["1. Create a new notification", "2. Check notifications list", "3. Verify new notification is visible"]', 
 'Newly created notification should appear in the notifications list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-NOTIF-020: Verify Edit Notification Button', 'Settings', 'Email Notifications', 'High', 
 '["1. Navigate to Email Notifications tab", "2. Click edit button on a notification", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled notification data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-NOTIF-021: Verify Pre-filled Data in Edit Form', 'Settings', 'Email Notifications', 'High', 
 '["1. Open edit notification dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current notification data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-NOTIF-022: Verify All Fields Editable', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Open edit notification dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-NOTIF-023: Verify Form Validation During Edit', 'Settings', 'Email Notifications', 'High', 
 '["1. Open edit notification dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-NOTIF-024: Verify Notification Update Success', 'Settings', 'Email Notifications', 'High', 
 '["1. Edit notification information", "2. Submit form", "3. Verify notification is updated"]', 
 'Notification should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-NOTIF-025: Verify Success Notification for Edit', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Update notification information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful notification update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-NOTIF-026: Verify Changes Reflected in List', 'Settings', 'Email Notifications', 'High', 
 '["1. Update notification information", "2. Check notifications list", "3. Verify changes are visible"]', 
 'Updated notification information should be reflected in the notifications list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-NOTIF-027: Verify Delete Notification Button', 'Settings', 'Email Notifications', 'High', 
 '["1. Navigate to Email Notifications tab", "2. Click delete button on a notification", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with notification name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-NOTIF-028: Verify Delete Confirmation Dialog', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify notification name is displayed"]', 
 'Confirmation dialog should show notification name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-NOTIF-029: Verify Notification Deletion Success', 'Settings', 'Email Notifications', 'High', 
 '["1. Confirm notification deletion", "2. Verify notification is deleted", "3. Check notifications list"]', 
 'Notification should be deleted successfully and removed from the notifications list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-NOTIF-030: Verify Success Notification for Delete', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Delete a notification", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful notification deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-NOTIF-031: Verify Notification Removed from List', 'Settings', 'Email Notifications', 'High', 
 '["1. Delete a notification", "2. Check notifications list", "3. Verify notification is no longer visible"]', 
 'Deleted notification should be removed from the notifications list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-NOTIF-032: Verify Status Toggle Button', 'Settings', 'Email Notifications', 'High', 
 '["1. Navigate to Email Notifications tab", "2. Click status toggle button on a notification", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-NOTIF-033: Verify Status Change Confirmation Dialog', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-NOTIF-034: Verify Notification Status Update Success', 'Settings', 'Email Notifications', 'High', 
 '["1. Confirm status change", "2. Verify notification status updates", "3. Check notifications list"]', 
 'Notification status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-NOTIF-035: Verify Status Change Reflected in List', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Change notification status", "2. Check notifications list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the notifications list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-NOTIF-036: Verify Error Handling for API Failures', 'Settings', 'Email Notifications', 'High', 
 '["1. Simulate API failure", "2. Perform notification operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-NOTIF-037: Verify Form Validation Error Display', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-NOTIF-038: Verify Network Error Handling', 'Settings', 'Email Notifications', 'Medium', 
 '["1. Disconnect network", "2. Try to perform notification operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
