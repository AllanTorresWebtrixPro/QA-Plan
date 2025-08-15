-- Settings Module - Users Management Testing
-- Test cases for Users CRUD operations, status management, password reset, and access settings

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Users Management Test Cases
('TC-USER-001: Verify Users List Display', 'Settings', 'Users', 'High', 
 '["1. Navigate to Settings", "2. Click on Users section", "3. Verify users list loads and displays correctly"]', 
 'Users list should load and display all users with proper formatting and data.', 
 '["Empty list", "Large number of users"]', NOW(), NOW()),

('TC-USER-002: Verify User Table Columns', 'Settings', 'Users', 'Medium', 
 '["1. Navigate to Users tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'User table should show columns: Name, Email, Role, Status, Actions.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-USER-003: Verify User Search Functionality', 'Settings', 'Users', 'Medium', 
 '["1. Navigate to Users tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter users based on entered search term (name, email, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-USER-004: Verify Role Filter', 'Settings', 'Users', 'Medium', 
 '["1. Navigate to Users tab", "2. Select a role from filter dropdown", "3. Verify users are filtered by role"]', 
 'Filter by role should show only users with the selected role (Admin, Lodge Manager).', 
 '["Multiple roles", "No users for role", "All roles option"]', NOW(), NOW()),

('TC-USER-005: Verify Status Filter', 'Settings', 'Users', 'Medium', 
 '["1. Navigate to Users tab", "2. Select a status from filter dropdown", "3. Verify users are filtered by status"]', 
 'Filter by status should show only users with the selected status (Active, Inactive).', 
 '["Active users", "Inactive users", "All statuses option"]', NOW(), NOW()),

('TC-USER-006: Verify Empty State Display', 'Settings', 'Users', 'Medium', 
 '["1. Navigate to Users tab", "2. Clear all users (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no users exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-USER-007: Verify Loading Skeleton', 'Settings', 'Users', 'Medium', 
 '["1. Navigate to Users tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while users data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-USER-008: Verify Add User Button', 'Settings', 'Users', 'High', 
 '["1. Navigate to Users tab", "2. Click Add User button", "3. Verify dialog opens"]', 
 'Add User button should open a dialog with user creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-USER-009: Verify Required Fields in Add Form', 'Settings', 'Users', 'High', 
 '["1. Open Add User dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (First Name*, Last Name*, Email*, Password*, Role*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-USER-010: Verify Role Selection Dropdown', 'Settings', 'Users', 'High', 
 '["1. Open Add User dialog", "2. Check role selection dropdown", "3. Verify roles are listed"]', 
 'Role selection dropdown should list available roles: Admin, Lodge Manager.', 
 '["Role permissions", "Default selection"]', NOW(), NOW()),

('TC-USER-011: Verify Form Validation for Required Fields', 'Settings', 'Users', 'High', 
 '["1. Open Add User dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-USER-012: Verify Email Format Validation', 'Settings', 'Users', 'High', 
 '["1. Open Add User dialog", "2. Enter invalid email format", "3. Try to submit form", "4. Verify email validation"]', 
 'Form should validate email format and show error for invalid emails.', 
 '["Various invalid formats", "Valid email formats"]', NOW(), NOW()),

('TC-USER-013: Verify Password Strength Validation', 'Settings', 'Users', 'High', 
 '["1. Open Add User dialog", "2. Enter weak password", "3. Try to submit form", "4. Verify password validation"]', 
 'Form should validate password strength and show error for weak passwords.', 
 '["Password requirements", "Strength indicators"]', NOW(), NOW()),

('TC-USER-014: Verify User Creation Success', 'Settings', 'Users', 'High', 
 '["1. Open Add User dialog", "2. Fill all required fields", "3. Submit form", "4. Verify user is created"]', 
 'User should be created successfully and appear in the users list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-USER-015: Verify Success Toast Notification', 'Settings', 'Users', 'Medium', 
 '["1. Create a new user", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after user creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-USER-016: Verify Dialog Close After Creation', 'Settings', 'Users', 'Medium', 
 '["1. Create a new user successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful user creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-USER-017: Verify New User Appears in List', 'Settings', 'Users', 'High', 
 '["1. Create a new user", "2. Check users list", "3. Verify new user is visible"]', 
 'Newly created user should appear in the users list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-USER-018: Verify Edit User Button', 'Settings', 'Users', 'High', 
 '["1. Navigate to Users tab", "2. Click edit button on a user", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled user data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-USER-019: Verify Pre-filled Data in Edit Form', 'Settings', 'Users', 'High', 
 '["1. Open edit user dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current user data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-USER-020: Verify All Fields Editable', 'Settings', 'Users', 'Medium', 
 '["1. Open edit user dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-USER-021: Verify Role Can Be Changed', 'Settings', 'Users', 'High', 
 '["1. Open edit user dialog", "2. Change role selection", "3. Verify role updates correctly"]', 
 'Role selection should update correctly and reflect the change.', 
 '["Role validation", "Permission updates"]', NOW(), NOW()),

('TC-USER-022: Verify Form Validation During Edit', 'Settings', 'Users', 'High', 
 '["1. Open edit user dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-USER-023: Verify User Update Success', 'Settings', 'Users', 'High', 
 '["1. Edit user information", "2. Submit form", "3. Verify user is updated"]', 
 'User should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-USER-024: Verify Success Notification for Edit', 'Settings', 'Users', 'Medium', 
 '["1. Update user information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful user update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-USER-025: Verify Changes Reflected in List', 'Settings', 'Users', 'High', 
 '["1. Update user information", "2. Check users list", "3. Verify changes are visible"]', 
 'Updated user information should be reflected in the users list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-USER-026: Verify Delete User Button', 'Settings', 'Users', 'High', 
 '["1. Navigate to Users tab", "2. Click delete button on a user", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with user name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-USER-027: Verify Delete Confirmation Dialog', 'Settings', 'Users', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify user name is displayed"]', 
 'Confirmation dialog should show user name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-USER-028: Verify User Deletion Success', 'Settings', 'Users', 'High', 
 '["1. Confirm user deletion", "2. Verify user is deleted", "3. Check users list"]', 
 'User should be deleted successfully and removed from the users list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-USER-029: Verify Success Notification for Delete', 'Settings', 'Users', 'Medium', 
 '["1. Delete a user", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful user deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-USER-030: Verify User Removed from List', 'Settings', 'Users', 'High', 
 '["1. Delete a user", "2. Check users list", "3. Verify user is no longer visible"]', 
 'Deleted user should be removed from the users list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- User Status Management Test Cases
('TC-USER-031: Verify Status Toggle Button', 'Settings', 'Users', 'High', 
 '["1. Navigate to Users tab", "2. Click status toggle button on a user", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-USER-032: Verify Status Change Confirmation Dialog', 'Settings', 'Users', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-USER-033: Verify User Status Update Success', 'Settings', 'Users', 'High', 
 '["1. Confirm status change", "2. Verify user status updates", "3. Check users list"]', 
 'User status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-USER-034: Verify Status Change Reflected in List', 'Settings', 'Users', 'Medium', 
 '["1. Change user status", "2. Check users list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the users list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Password Reset Test Cases
('TC-USER-035: Verify Reset Password Button', 'Settings', 'Users', 'High', 
 '["1. Navigate to Users tab", "2. Click Reset Password button on a user", "3. Verify reset confirmation dialog opens"]', 
 'Reset Password button should open confirmation dialog.', 
 '["Button state", "Multiple clicks"]', NOW(), NOW()),

('TC-USER-036: Verify Password Reset Confirmation Dialog', 'Settings', 'Users', 'Medium', 
 '["1. Open password reset confirmation dialog", "2. Check dialog content", "3. Verify reset confirmation is clear"]', 
 'Confirmation dialog should clearly explain the password reset process.', 
 '["Dialog styling", "Button labels", "Process explanation"]', NOW(), NOW()),

('TC-USER-037: Verify Password Reset Email Sent', 'Settings', 'Users', 'High', 
 '["1. Confirm password reset", "2. Verify reset email is sent", "3. Check success notification"]', 
 'Password reset email should be sent to the user and success notification should appear.', 
 '["Email delivery", "Notification timing"]', NOW(), NOW()),

('TC-USER-038: Verify Success Notification for Reset', 'Settings', 'Users', 'Medium', 
 '["1. Reset user password", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful password reset.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

-- Access Settings Test Cases
('TC-USER-039: Verify Access Settings Button', 'Settings', 'Users', 'High', 
 '["1. Navigate to Users tab", "2. Click Access Settings button on a user", "3. Verify access settings dialog opens"]', 
 'Access Settings button should open dialog for configuring brand and lodge access.', 
 '["Button state", "Multiple clicks"]', NOW(), NOW()),

('TC-USER-040: Verify Brand and Lodge Access Configuration', 'Settings', 'Users', 'High', 
 '["1. Open access settings dialog", "2. Configure brand and lodge access", "3. Verify configuration options"]', 
 'Access settings dialog should allow configuration of brand and lodge access for the user.', 
 '["Access levels", "Permission settings"]', NOW(), NOW()),

('TC-USER-041: Verify Access Settings Save Success', 'Settings', 'Users', 'High', 
 '["1. Configure access settings", "2. Save configuration", "3. Verify settings are saved"]', 
 'Access settings should be saved successfully and applied to the user.', 
 '["Settings persistence", "Success feedback"]', NOW(), NOW()),

('TC-USER-042: Verify Access Settings Applied Correctly', 'Settings', 'Users', 'Medium', 
 '["1. Save access settings", "2. Verify settings are applied", "3. Test user access"]', 
 'Access settings should be correctly applied and user should have appropriate access.', 
 '["Access validation", "Permission testing"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-USER-043: Verify Error Handling for API Failures', 'Settings', 'Users', 'High', 
 '["1. Simulate API failure", "2. Perform user operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-USER-044: Verify Form Validation Error Display', 'Settings', 'Users', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-USER-045: Verify Network Error Handling', 'Settings', 'Users', 'Medium', 
 '["1. Disconnect network", "2. Try to perform user operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
