-- Settings Module - Surveys Management Testing
-- Test cases for Surveys CRUD operations, questions management, responses, and status management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Surveys Management Test Cases
('TC-SURV-001: Verify Surveys List Display', 'Settings', 'Surveys', 'High', 
 '["1. Navigate to Settings", "2. Click on Surveys section", "3. Verify surveys list loads and displays correctly"]', 
 'Surveys list should load and display all surveys with proper formatting and data.', 
 '["Empty list", "Large number of surveys"]', NOW(), NOW()),

('TC-SURV-002: Verify Surveys Table Columns', 'Settings', 'Surveys', 'Medium', 
 '["1. Navigate to Surveys tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Surveys table should show columns: Title, Brand, Status, Questions Count, Responses Count, Actions.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-SURV-003: Verify Surveys Search Functionality', 'Settings', 'Surveys', 'Medium', 
 '["1. Navigate to Surveys tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter surveys based on entered search term (title, brand, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-SURV-004: Verify Brand Filter', 'Settings', 'Surveys', 'Medium', 
 '["1. Navigate to Surveys tab", "2. Select a brand from filter dropdown", "3. Verify surveys are filtered by brand"]', 
 'Filter by brand should show only surveys belonging to the selected brand.', 
 '["Multiple brands", "No surveys for brand", "All brands option"]', NOW(), NOW()),

('TC-SURV-005: Verify Status Filter', 'Settings', 'Surveys', 'Medium', 
 '["1. Navigate to Surveys tab", "2. Select a status from filter dropdown", "3. Verify surveys are filtered by status"]', 
 'Filter by status should show only surveys with the selected status (Active, Inactive, Draft).', 
 '["Active surveys", "Inactive surveys", "Draft surveys", "All statuses option"]', NOW(), NOW()),

('TC-SURV-006: Verify Empty State Display', 'Settings', 'Surveys', 'Medium', 
 '["1. Navigate to Surveys tab", "2. Clear all surveys (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no surveys exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-SURV-007: Verify Loading Skeleton', 'Settings', 'Surveys', 'Medium', 
 '["1. Navigate to Surveys tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while surveys data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-SURV-008: Verify Add Survey Button', 'Settings', 'Surveys', 'High', 
 '["1. Navigate to Surveys tab", "2. Click Add Survey button", "3. Verify dialog opens"]', 
 'Add Survey button should open a dialog with survey creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-SURV-009: Verify Required Fields in Add Form', 'Settings', 'Surveys', 'High', 
 '["1. Open Add Survey dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Title*, Brand*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-SURV-010: Verify Brand Selection Dropdown', 'Settings', 'Surveys', 'High', 
 '["1. Open Add Survey dialog", "2. Check brand selection dropdown", "3. Verify all brands are listed"]', 
 'Brand selection dropdown should list all available brands for survey assignment.', 
 '["No brands available", "Many brands", "Brand names"]', NOW(), NOW()),

('TC-SURV-011: Verify Form Validation for Required Fields', 'Settings', 'Surveys', 'High', 
 '["1. Open Add Survey dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-SURV-012: Verify Survey Creation Success', 'Settings', 'Surveys', 'High', 
 '["1. Open Add Survey dialog", "2. Fill all required fields", "3. Submit form", "4. Verify survey is created"]', 
 'Survey should be created successfully and appear in the surveys list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-SURV-013: Verify Success Toast Notification', 'Settings', 'Surveys', 'Medium', 
 '["1. Create a new survey", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after survey creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-SURV-014: Verify Dialog Close After Creation', 'Settings', 'Surveys', 'Medium', 
 '["1. Create a new survey successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful survey creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-SURV-015: Verify New Survey Appears in List', 'Settings', 'Surveys', 'High', 
 '["1. Create a new survey", "2. Check surveys list", "3. Verify new survey is visible"]', 
 'Newly created survey should appear in the surveys list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-SURV-016: Verify Edit Survey Button', 'Settings', 'Surveys', 'High', 
 '["1. Navigate to Surveys tab", "2. Click edit button on a survey", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled survey data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-SURV-017: Verify Pre-filled Data in Edit Form', 'Settings', 'Surveys', 'High', 
 '["1. Open edit survey dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current survey data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-SURV-018: Verify All Fields Editable', 'Settings', 'Surveys', 'Medium', 
 '["1. Open edit survey dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-SURV-019: Verify Form Validation During Edit', 'Settings', 'Surveys', 'High', 
 '["1. Open edit survey dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-SURV-020: Verify Survey Update Success', 'Settings', 'Surveys', 'High', 
 '["1. Edit survey information", "2. Submit form", "3. Verify survey is updated"]', 
 'Survey should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-SURV-021: Verify Success Notification for Edit', 'Settings', 'Surveys', 'Medium', 
 '["1. Update survey information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful survey update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-SURV-022: Verify Changes Reflected in List', 'Settings', 'Surveys', 'High', 
 '["1. Update survey information", "2. Check surveys list", "3. Verify changes are visible"]', 
 'Updated survey information should be reflected in the surveys list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-SURV-023: Verify Delete Survey Button', 'Settings', 'Surveys', 'High', 
 '["1. Navigate to Surveys tab", "2. Click delete button on a survey", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with survey title.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-SURV-024: Verify Delete Confirmation Dialog', 'Settings', 'Surveys', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify survey title is displayed"]', 
 'Confirmation dialog should show survey title and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-SURV-025: Verify Survey Deletion Success', 'Settings', 'Surveys', 'High', 
 '["1. Confirm survey deletion", "2. Verify survey is deleted", "3. Check surveys list"]', 
 'Survey should be deleted successfully and removed from the surveys list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-SURV-026: Verify Success Notification for Delete', 'Settings', 'Surveys', 'Medium', 
 '["1. Delete a survey", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful survey deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-SURV-027: Verify Survey Removed from List', 'Settings', 'Surveys', 'High', 
 '["1. Delete a survey", "2. Check surveys list", "3. Verify survey is no longer visible"]', 
 'Deleted survey should be removed from the surveys list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Survey Questions Management Test Cases
('TC-SURV-028: Verify Manage Questions Button', 'Settings', 'Surveys', 'High', 
 '["1. Navigate to Surveys tab", "2. Click Manage Questions button on a survey", "3. Verify questions page opens"]', 
 'Manage Questions button should open questions management page for the survey.', 
 '["Button state", "Page navigation"]', NOW(), NOW()),

('TC-SURV-029: Verify Questions Can Be Added', 'Settings', 'Surveys', 'High', 
 '["1. Open survey questions page", "2. Click Add Question button", "3. Verify question can be added"]', 
 'Questions should be able to be added to the survey with proper form validation.', 
 '["Question types", "Form validation", "Question order"]', NOW(), NOW()),

('TC-SURV-030: Verify Questions Can Be Reordered', 'Settings', 'Surveys', 'Medium', 
 '["1. Open survey questions page", "2. Try to reorder questions", "3. Verify reordering works"]', 
 'Questions should be able to be reordered using drag and drop or reorder buttons.', 
 '["Drag and drop", "Reorder buttons", "Order persistence"]', NOW(), NOW()),

('TC-SURV-031: Verify Questions Can Be Edited', 'Settings', 'Surveys', 'High', 
 '["1. Open survey questions page", "2. Click edit button on a question", "3. Verify question can be edited"]', 
 'Questions should be editable with proper form validation and data persistence.', 
 '["Edit form", "Validation", "Data persistence"]', NOW(), NOW()),

('TC-SURV-032: Verify Questions Can Be Deleted', 'Settings', 'Surveys', 'High', 
 '["1. Open survey questions page", "2. Click delete button on a question", "3. Verify question can be deleted"]', 
 'Questions should be deletable with proper confirmation and data removal.', 
 '["Delete confirmation", "Data removal", "List update"]', NOW(), NOW()),

-- Survey Responses Test Cases
('TC-SURV-033: Verify View Responses Button', 'Settings', 'Surveys', 'Medium', 
 '["1. Navigate to Surveys tab", "2. Click View Responses button on a survey", "3. Verify responses page opens"]', 
 'View Responses button should open responses page for the survey.', 
 '["Button state", "Page navigation"]', NOW(), NOW()),

('TC-SURV-034: Verify Responses Are Displayed', 'Settings', 'Surveys', 'Medium', 
 '["1. Open survey responses page", "2. Check responses list", "3. Verify responses are displayed correctly"]', 
 'Survey responses should be displayed correctly with proper formatting and data.', 
 '["Response formatting", "Data accuracy", "Response details"]', NOW(), NOW()),

('TC-SURV-035: Verify Responses Can Be Exported', 'Settings', 'Surveys', 'Medium', 
 '["1. Open survey responses page", "2. Click export button", "3. Verify responses can be exported"]', 
 'Survey responses should be exportable in common formats (CSV, Excel, PDF).', 
 '["Export formats", "File download", "Data completeness"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-SURV-036: Verify Status Toggle Button', 'Settings', 'Surveys', 'High', 
 '["1. Navigate to Surveys tab", "2. Click status toggle button on a survey", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active", "Draft to active"]', NOW(), NOW()),

('TC-SURV-037: Verify Status Change Confirmation Dialog', 'Settings', 'Surveys', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-SURV-038: Verify Survey Status Update Success', 'Settings', 'Surveys', 'High', 
 '["1. Confirm status change", "2. Verify survey status updates", "3. Check surveys list"]', 
 'Survey status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-SURV-039: Verify Status Change Reflected in List', 'Settings', 'Surveys', 'Medium', 
 '["1. Change survey status", "2. Check surveys list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the surveys list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-SURV-040: Verify Error Handling for API Failures', 'Settings', 'Surveys', 'High', 
 '["1. Simulate API failure", "2. Perform survey operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-SURV-041: Verify Network Error Handling', 'Settings', 'Surveys', 'Medium', 
 '["1. Disconnect network", "2. Try to perform survey operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
