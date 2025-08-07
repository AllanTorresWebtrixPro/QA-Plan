-- Settings Module - Lodges Management Testing
-- Test cases for Lodges CRUD operations

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Lodges Management Test Cases
('TC-LODGE-001: Verify Lodges List Display', 'Settings', 'Company', 'High', 
 '["1. Navigate to Company settings page", "2. Click on Lodges tab", "3. Verify lodges list loads and displays correctly"]', 
 'Lodges list should load and display all lodges with proper formatting and data.', 
 '["Empty list", "Large number of lodges"]', NOW(), NOW()),

('TC-LODGE-002: Verify Lodge Table Columns', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Lodges tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Lodge table should show columns: Brand, Name, Type, Logo, Address, Phone, Description, Supporting Docs.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-LODGE-003: Verify Lodge Search Functionality', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Lodges tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter lodges based on entered search term (name, brand, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-LODGE-004: Verify Filter by Brand', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Lodges tab", "2. Select a brand from filter dropdown", "3. Verify lodges are filtered by brand"]', 
 'Filter by brand should show only lodges belonging to the selected brand.', 
 '["Multiple brands", "No lodges for brand", "All brands option"]', NOW(), NOW()),

('TC-LODGE-005: Verify Empty State Display', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Lodges tab", "2. Clear all lodges (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no lodges exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-LODGE-006: Verify Loading Skeleton', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Lodges tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while lodges data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-LODGE-007: Verify Add Lodge Button', 'Settings', 'Company', 'High', 
 '["1. Navigate to Lodges tab", "2. Click Add Lodge button", "3. Verify dialog opens"]', 
 'Add Lodge button should open a dialog with lodge creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-LODGE-008: Verify Brand Selection Dropdown', 'Settings', 'Company', 'High', 
 '["1. Open Add Lodge dialog", "2. Check brand selection dropdown", "3. Verify all brands are listed"]', 
 'Brand selection dropdown should list all available brands for lodge assignment.', 
 '["No brands available", "Many brands", "Brand names"]', NOW(), NOW()),

('TC-LODGE-009: Verify Required Fields in Add Form', 'Settings', 'Company', 'High', 
 '["1. Open Add Lodge dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Brand*, Name*, Type*, Address*, Phone*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-LODGE-010: Verify Optional Fields in Add Form', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Lodge dialog", "2. Check form fields", "3. Verify optional fields are present"]', 
 'Optional fields (Logo, Description, Supporting Docs) should be present but not required.', 
 '["Field behavior", "Form validation"]', NOW(), NOW()),

('TC-LODGE-011: Verify Lodge Types', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Lodge dialog", "2. Check lodge type dropdown", "3. Verify types are correct"]', 
 'Lodge types should include: Hunting, Fishing, Big Game.', 
 '["Type selection", "Default selection"]', NOW(), NOW()),

('TC-LODGE-012: Verify Form Validation for Required Fields', 'Settings', 'Company', 'High', 
 '["1. Open Add Lodge dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-LODGE-013: Verify Phone Number Validation', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Lodge dialog", "2. Enter invalid phone number", "3. Try to submit form", "4. Verify phone validation"]', 
 'Form should validate phone number format and show error for invalid numbers.', 
 '["International formats", "Special characters"]', NOW(), NOW()),

('TC-LODGE-014: Verify Logo Upload Functionality', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Lodge dialog", "2. Click on logo upload field", "3. Select image file", "4. Verify upload works"]', 
 'Logo upload should accept image files and display preview.', 
 '["File size limits", "File type restrictions", "Upload progress"]', NOW(), NOW()),

('TC-LODGE-015: Verify Supporting Docs Selection', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Lodge dialog", "2. Click on supporting docs field", "3. Select documents", "4. Verify selection works"]', 
 'Supporting docs selection should allow multiple document selection.', 
 '["Document types", "File size limits", "Multiple files"]', NOW(), NOW()),

('TC-LODGE-016: Verify Lodge Creation Success', 'Settings', 'Company', 'High', 
 '["1. Open Add Lodge dialog", "2. Fill all required fields", "3. Submit form", "4. Verify lodge is created"]', 
 'Lodge should be created successfully and appear in the lodges list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-LODGE-017: Verify Success Toast Notification', 'Settings', 'Company', 'Medium', 
 '["1. Create a new lodge", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after lodge creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-LODGE-018: Verify Dialog Close After Creation', 'Settings', 'Company', 'Medium', 
 '["1. Create a new lodge successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful lodge creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-LODGE-019: Verify New Lodge Appears in List', 'Settings', 'Company', 'High', 
 '["1. Create a new lodge", "2. Check lodges list", "3. Verify new lodge is visible"]', 
 'Newly created lodge should appear in the lodges list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-LODGE-020: Verify Edit Lodge Button', 'Settings', 'Company', 'High', 
 '["1. Navigate to Lodges tab", "2. Click edit button on a lodge", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled lodge data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-LODGE-021: Verify Pre-filled Data in Edit Form', 'Settings', 'Company', 'High', 
 '["1. Open edit lodge dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current lodge data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-LODGE-022: Verify All Fields Editable', 'Settings', 'Company', 'Medium', 
 '["1. Open edit lodge dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-LODGE-023: Verify Brand Selection Updates', 'Settings', 'Company', 'Medium', 
 '["1. Open edit lodge dialog", "2. Change brand selection", "3. Verify brand updates correctly"]', 
 'Brand selection should update correctly and reflect the change.', 
 '["Brand validation", "Related data updates"]', NOW(), NOW()),

('TC-LODGE-024: Verify Form Validation During Edit', 'Settings', 'Company', 'High', 
 '["1. Open edit lodge dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-LODGE-025: Verify Lodge Update Success', 'Settings', 'Company', 'High', 
 '["1. Edit lodge information", "2. Submit form", "3. Verify lodge is updated"]', 
 'Lodge should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-LODGE-026: Verify Success Notification for Edit', 'Settings', 'Company', 'Medium', 
 '["1. Update lodge information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful lodge update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-LODGE-027: Verify Changes Reflected in List', 'Settings', 'Company', 'High', 
 '["1. Update lodge information", "2. Check lodges list", "3. Verify changes are visible"]', 
 'Updated lodge information should be reflected in the lodges list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-LODGE-028: Verify Delete Lodge Button', 'Settings', 'Company', 'High', 
 '["1. Navigate to Lodges tab", "2. Click delete button on a lodge", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with lodge name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-LODGE-029: Verify Delete Confirmation Dialog', 'Settings', 'Company', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify lodge name is displayed"]', 
 'Confirmation dialog should show lodge name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-LODGE-030: Verify Lodge Deletion Success', 'Settings', 'Company', 'High', 
 '["1. Confirm lodge deletion", "2. Verify lodge is deleted", "3. Check lodges list"]', 
 'Lodge should be deleted successfully and removed from the lodges list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-LODGE-031: Verify Success Notification for Delete', 'Settings', 'Company', 'Medium', 
 '["1. Delete a lodge", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful lodge deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-LODGE-032: Verify Lodge Removed from List', 'Settings', 'Company', 'High', 
 '["1. Delete a lodge", "2. Check lodges list", "3. Verify lodge is no longer visible"]', 
 'Deleted lodge should be removed from the lodges list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

('TC-LODGE-033: Verify Statistics Update After Delete', 'Settings', 'Company', 'Medium', 
 '["1. Note initial Total Lodges count", "2. Delete a lodge", "3. Verify count decreases"]', 
 'Total Lodges count should decrease by 1 after lodge deletion.', 
 '["Count accuracy", "Real-time update"]', NOW(), NOW()),

('TC-LODGE-034: Verify View Lodge Details', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Lodges tab", "2. Click view button on a lodge", "3. Verify details dialog opens"]', 
 'View button should open dialog showing all lodge information.', 
 '["Data display", "Dialog content"]', NOW(), NOW()),

('TC-LODGE-035: Verify Lodge Information Display', 'Settings', 'Company', 'Medium', 
 '["1. Open lodge details dialog", "2. Check all lodge information", "3. Verify data is displayed correctly"]', 
 'All lodge information should be displayed correctly in the details dialog.', 
 '["Data accuracy", "Formatting"]', NOW(), NOW()),

('TC-LODGE-036: Verify Logo and Supporting Docs Display', 'Settings', 'Company', 'Medium', 
 '["1. Open lodge details dialog", "2. Check logo image and supporting docs", "3. Verify files display correctly"]', 
 'Logo image and supporting documents should display correctly in the details dialog.', 
 '["File loading", "File quality", "Missing files"]', NOW(), NOW()),

('TC-LODGE-037: Verify Error Handling for API Failures', 'Settings', 'Company', 'High', 
 '["1. Simulate API failure", "2. Perform lodge operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-LODGE-038: Verify Form Validation Error Display', 'Settings', 'Company', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-LODGE-039: Verify Network Error Handling', 'Settings', 'Company', 'Medium', 
 '["1. Disconnect network", "2. Try to perform lodge operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
