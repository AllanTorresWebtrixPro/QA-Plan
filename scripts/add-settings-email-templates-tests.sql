-- Settings Module - Email Templates Management Testing
-- Test cases for Email Templates CRUD operations, preview, test functionality, and status management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Email Templates Management Test Cases
('TC-TEMP-001: Verify Templates List Display', 'Settings', 'Email Templates', 'High', 
 '["1. Navigate to Settings", "2. Click on Email Templates section", "3. Verify templates list loads and displays correctly"]', 
 'Templates list should load and display all email templates with proper formatting and data.', 
 '["Empty list", "Large number of templates"]', NOW(), NOW()),

('TC-TEMP-002: Verify Templates Table Columns', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Templates table should show columns: Name, Type, Brand, Status, Last Updated, Actions.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-TEMP-003: Verify Templates Search Functionality', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter templates based on entered search term (name, type, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-TEMP-004: Verify Type Filter', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Select a type from filter dropdown", "3. Verify templates are filtered by type"]', 
 'Filter by type should show only templates with the selected type.', 
 '["Multiple types", "No templates for type", "All types option"]', NOW(), NOW()),

('TC-TEMP-005: Verify Brand Filter', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Select a brand from filter dropdown", "3. Verify templates are filtered by brand"]', 
 'Filter by brand should show only templates belonging to the selected brand.', 
 '["Multiple brands", "No templates for brand", "All brands option"]', NOW(), NOW()),

('TC-TEMP-006: Verify Status Filter', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Select a status from filter dropdown", "3. Verify templates are filtered by status"]', 
 'Filter by status should show only templates with the selected status (Active, Inactive).', 
 '["Active templates", "Inactive templates", "All statuses option"]', NOW(), NOW()),

('TC-TEMP-007: Verify Empty State Display', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Clear all templates (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no templates exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-TEMP-008: Verify Loading Skeleton', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while templates data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-TEMP-009: Verify Add Template Button', 'Settings', 'Email Templates', 'High', 
 '["1. Navigate to Email Templates tab", "2. Click Add Template button", "3. Verify dialog opens"]', 
 'Add Template button should open a dialog with template creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-TEMP-010: Verify Required Fields in Add Form', 'Settings', 'Email Templates', 'High', 
 '["1. Open Add Template dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Name*, Type*, Brand*, Subject*, Content*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-TEMP-011: Verify Type Selection Dropdown', 'Settings', 'Email Templates', 'High', 
 '["1. Open Add Template dialog", "2. Check type selection dropdown", "3. Verify types are listed"]', 
 'Type selection dropdown should list available email template types.', 
 '["Template types", "Default selection"]', NOW(), NOW()),

('TC-TEMP-012: Verify Brand Selection Dropdown', 'Settings', 'Email Templates', 'High', 
 '["1. Open Add Template dialog", "2. Check brand selection dropdown", "3. Verify all brands are listed"]', 
 'Brand selection dropdown should list all available brands for template assignment.', 
 '["No brands available", "Many brands", "Brand names"]', NOW(), NOW()),

('TC-TEMP-013: Verify Rich Text Editor', 'Settings', 'Email Templates', 'Medium', 
 '["1. Open Add Template dialog", "2. Check content field", "3. Verify rich text editor works"]', 
 'Content field should have rich text editor with formatting options for email content.', 
 '["Text formatting", "HTML content", "Editor toolbar"]', NOW(), NOW()),

('TC-TEMP-014: Verify Form Validation for Required Fields', 'Settings', 'Email Templates', 'High', 
 '["1. Open Add Template dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-TEMP-015: Verify Template Creation Success', 'Settings', 'Email Templates', 'High', 
 '["1. Open Add Template dialog", "2. Fill all required fields", "3. Submit form", "4. Verify template is created"]', 
 'Template should be created successfully and appear in the templates list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-TEMP-016: Verify Success Toast Notification', 'Settings', 'Email Templates', 'Medium', 
 '["1. Create a new template", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after template creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-TEMP-017: Verify Dialog Close After Creation', 'Settings', 'Email Templates', 'Medium', 
 '["1. Create a new template successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful template creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-TEMP-018: Verify New Template Appears in List', 'Settings', 'Email Templates', 'High', 
 '["1. Create a new template", "2. Check templates list", "3. Verify new template is visible"]', 
 'Newly created template should appear in the templates list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-TEMP-019: Verify Edit Template Button', 'Settings', 'Email Templates', 'High', 
 '["1. Navigate to Email Templates tab", "2. Click edit button on a template", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled template data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-TEMP-020: Verify Pre-filled Data in Edit Form', 'Settings', 'Email Templates', 'High', 
 '["1. Open edit template dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current template data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-TEMP-021: Verify All Fields Editable', 'Settings', 'Email Templates', 'Medium', 
 '["1. Open edit template dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-TEMP-022: Verify Rich Text Editor Loads Content', 'Settings', 'Email Templates', 'Medium', 
 '["1. Open edit template dialog", "2. Check rich text editor", "3. Verify existing content loads"]', 
 'Rich text editor should load existing content with proper formatting.', 
 '["Content formatting", "HTML preservation", "Editor state"]', NOW(), NOW()),

('TC-TEMP-023: Verify Form Validation During Edit', 'Settings', 'Email Templates', 'High', 
 '["1. Open edit template dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-TEMP-024: Verify Template Update Success', 'Settings', 'Email Templates', 'High', 
 '["1. Edit template information", "2. Submit form", "3. Verify template is updated"]', 
 'Template should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-TEMP-025: Verify Success Notification for Edit', 'Settings', 'Email Templates', 'Medium', 
 '["1. Update template information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful template update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-TEMP-026: Verify Changes Reflected in List', 'Settings', 'Email Templates', 'High', 
 '["1. Update template information", "2. Check templates list", "3. Verify changes are visible"]', 
 'Updated template information should be reflected in the templates list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-TEMP-027: Verify Delete Template Button', 'Settings', 'Email Templates', 'High', 
 '["1. Navigate to Email Templates tab", "2. Click delete button on a template", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with template name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-TEMP-028: Verify Delete Confirmation Dialog', 'Settings', 'Email Templates', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify template name is displayed"]', 
 'Confirmation dialog should show template name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-TEMP-029: Verify Template Deletion Success', 'Settings', 'Email Templates', 'High', 
 '["1. Confirm template deletion", "2. Verify template is deleted", "3. Check templates list"]', 
 'Template should be deleted successfully and removed from the templates list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-TEMP-030: Verify Success Notification for Delete', 'Settings', 'Email Templates', 'Medium', 
 '["1. Delete a template", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful template deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-TEMP-031: Verify Template Removed from List', 'Settings', 'Email Templates', 'High', 
 '["1. Delete a template", "2. Check templates list", "3. Verify template is no longer visible"]', 
 'Deleted template should be removed from the templates list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Preview Template Test Cases
('TC-TEMP-032: Verify Preview Button', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Click preview button on a template", "3. Verify preview opens"]', 
 'Preview button should open template preview in new tab/window or preview dialog.', 
 '["Preview method", "Button state"]', NOW(), NOW()),

('TC-TEMP-033: Verify Template Display in Preview', 'Settings', 'Email Templates', 'Medium', 
 '["1. Open template preview", "2. Check template content", "3. Verify template displays correctly"]', 
 'Template should display correctly in preview with proper formatting and layout.', 
 '["Content formatting", "Layout", "Readability"]', NOW(), NOW()),

-- Test Template Test Cases
('TC-TEMP-034: Verify Test Button', 'Settings', 'Email Templates', 'Medium', 
 '["1. Navigate to Email Templates tab", "2. Click test button on a template", "3. Verify test dialog opens"]', 
 'Test button should open test dialog for sending test email.', 
 '["Button state", "Dialog opening"]', NOW(), NOW()),

('TC-TEMP-035: Verify Test Email Can Be Sent', 'Settings', 'Email Templates', 'Medium', 
 '["1. Open test dialog", "2. Enter test email address", "3. Send test email", "4. Verify email is sent"]', 
 'Test email should be sent successfully using the template content.', 
 '["Email delivery", "Template content", "Test recipient"]', NOW(), NOW()),

('TC-TEMP-036: Verify Test Email Contains Template Content', 'Settings', 'Email Templates', 'Medium', 
 '["1. Send test email", "2. Check received email", "3. Verify template content is included"]', 
 'Test email should contain the template content with proper formatting.', 
 '["Content verification", "Formatting", "Template variables"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-TEMP-037: Verify Status Toggle Button', 'Settings', 'Email Templates', 'High', 
 '["1. Navigate to Email Templates tab", "2. Click status toggle button on a template", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-TEMP-038: Verify Status Change Confirmation Dialog', 'Settings', 'Email Templates', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-TEMP-039: Verify Template Status Update Success', 'Settings', 'Email Templates', 'High', 
 '["1. Confirm status change", "2. Verify template status updates", "3. Check templates list"]', 
 'Template status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-TEMP-040: Verify Status Change Reflected in List', 'Settings', 'Email Templates', 'Medium', 
 '["1. Change template status", "2. Check templates list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the templates list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-TEMP-041: Verify Error Handling for API Failures', 'Settings', 'Email Templates', 'High', 
 '["1. Simulate API failure", "2. Perform template operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-TEMP-042: Verify Form Validation Error Display', 'Settings', 'Email Templates', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-TEMP-043: Verify Network Error Handling', 'Settings', 'Email Templates', 'Medium', 
 '["1. Disconnect network", "2. Try to perform template operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
