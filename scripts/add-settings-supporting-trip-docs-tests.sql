-- Settings Module - Supporting Trip Docs Management Testing
-- Test cases for Supporting Trip Docs CRUD operations, file upload, download, and status management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Supporting Trip Docs Management Test Cases
('TC-DOC-001: Verify Docs List Display', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Navigate to Settings", "2. Click on Supporting Trip Docs section", "3. Verify docs list loads and displays correctly"]', 
 'Docs list should load and display all documents with proper formatting and data.', 
 '["Empty list", "Large number of documents"]', NOW(), NOW()),

('TC-DOC-002: Verify Docs Table Columns', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Docs table should show columns: Name, Type, Brand, Lodge, Status, Actions.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-DOC-003: Verify Docs Search Functionality', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter documents based on entered search term (name, type, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-DOC-004: Verify Brand Filter', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Select a brand from filter dropdown", "3. Verify docs are filtered by brand"]', 
 'Filter by brand should show only documents belonging to the selected brand.', 
 '["Multiple brands", "No docs for brand", "All brands option"]', NOW(), NOW()),

('TC-DOC-005: Verify Lodge Filter', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Select a lodge from filter dropdown", "3. Verify docs are filtered by lodge"]', 
 'Filter by lodge should show only documents belonging to the selected lodge.', 
 '["Multiple lodges", "No docs for lodge", "All lodges option"]', NOW(), NOW()),

('TC-DOC-006: Verify Status Filter', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Select a status from filter dropdown", "3. Verify docs are filtered by status"]', 
 'Filter by status should show only documents with the selected status (Active, Inactive).', 
 '["Active docs", "Inactive docs", "All statuses option"]', NOW(), NOW()),

('TC-DOC-007: Verify Empty State Display', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Clear all documents (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no documents exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-DOC-008: Verify Loading Skeleton', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while documents data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-DOC-009: Verify Add Doc Button', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Click Add Doc button", "3. Verify dialog opens"]', 
 'Add Doc button should open a dialog with document creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-DOC-010: Verify Required Fields in Add Form', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open Add Doc dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Name*, Type*, Brand*, Lodge*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-DOC-011: Verify Brand Selection Dropdown', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open Add Doc dialog", "2. Check brand selection dropdown", "3. Verify all brands are listed"]', 
 'Brand selection dropdown should list all available brands for document assignment.', 
 '["No brands available", "Many brands", "Brand names"]', NOW(), NOW()),

('TC-DOC-012: Verify Lodge Selection Updates Based on Brand', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open Add Doc dialog", "2. Select a brand", "3. Check lodge selection dropdown", "4. Verify lodges update based on brand"]', 
 'Lodge selection dropdown should update to show only lodges belonging to the selected brand.', 
 '["Lodge filtering", "Brand-lodge relationship"]', NOW(), NOW()),

('TC-DOC-013: Verify File Upload Functionality', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open Add Doc dialog", "2. Click on file upload field", "3. Select a file", "4. Verify upload works"]', 
 'File upload should accept document files and display upload progress.', 
 '["File size limits", "File type restrictions", "Upload progress"]', NOW(), NOW()),

('TC-DOC-014: Verify Form Validation for Required Fields', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open Add Doc dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-DOC-015: Verify Document Creation Success', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open Add Doc dialog", "2. Fill all required fields", "3. Upload file", "4. Submit form", "5. Verify document is created"]', 
 'Document should be created successfully and appear in the documents list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-DOC-016: Verify Success Toast Notification', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Create a new document", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after document creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-DOC-017: Verify Dialog Close After Creation', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Create a new document successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful document creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-DOC-018: Verify New Document Appears in List', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Create a new document", "2. Check documents list", "3. Verify new document is visible"]', 
 'Newly created document should appear in the documents list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-DOC-019: Verify Edit Document Button', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Click edit button on a document", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled document data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-DOC-020: Verify Pre-filled Data in Edit Form', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open edit document dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current document data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-DOC-021: Verify All Fields Editable', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Open edit document dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-DOC-022: Verify File Can Be Replaced', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Open edit document dialog", "2. Click on file upload field", "3. Select new file", "4. Verify file replacement works"]', 
 'File upload should allow replacing existing file with new file.', 
 '["File replacement", "Upload progress", "File validation"]', NOW(), NOW()),

('TC-DOC-023: Verify Form Validation During Edit', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Open edit document dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-DOC-024: Verify Document Update Success', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Edit document information", "2. Submit form", "3. Verify document is updated"]', 
 'Document should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-DOC-025: Verify Success Notification for Edit', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Update document information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful document update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-DOC-026: Verify Changes Reflected in List', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Update document information", "2. Check documents list", "3. Verify changes are visible"]', 
 'Updated document information should be reflected in the documents list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-DOC-027: Verify Delete Document Button', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Click delete button on a document", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with document name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-DOC-028: Verify Delete Confirmation Dialog', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify document name is displayed"]', 
 'Confirmation dialog should show document name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-DOC-029: Verify Document Deletion Success', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Confirm document deletion", "2. Verify document is deleted", "3. Check documents list"]', 
 'Document should be deleted successfully and removed from the documents list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-DOC-030: Verify Success Notification for Delete', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Delete a document", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful document deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-DOC-031: Verify Document Removed from List', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Delete a document", "2. Check documents list", "3. Verify document is no longer visible"]', 
 'Deleted document should be removed from the documents list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

-- Download Document Test Cases
('TC-DOC-032: Verify Download Button', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Click download button on a document", "3. Verify download starts"]', 
 'Download button should initiate file download for the selected document.', 
 '["Download progress", "File size", "Download location"]', NOW(), NOW()),

('TC-DOC-033: Verify File Downloads Correctly', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Download a document", "2. Check downloaded file", "3. Verify file integrity"]', 
 'Downloaded file should be complete and match the original file.', 
 '["File integrity", "File size", "File type"]', NOW(), NOW()),

('TC-DOC-034: Verify File Name is Preserved', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Download a document", "2. Check downloaded file name", "3. Verify name is preserved"]', 
 'Downloaded file should preserve the original file name.', 
 '["File naming", "Special characters", "File extensions"]', NOW(), NOW()),

-- Status Management Test Cases
('TC-DOC-035: Verify Status Toggle Button', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Navigate to Supporting Trip Docs tab", "2. Click status toggle button on a document", "3. Verify status change dialog opens"]', 
 'Status toggle button should open confirmation dialog for status change.', 
 '["Active to inactive", "Inactive to active"]', NOW(), NOW()),

('TC-DOC-036: Verify Status Change Confirmation Dialog', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Open status change confirmation dialog", "2. Check dialog content", "3. Verify status change is clear"]', 
 'Confirmation dialog should clearly show the status change being made.', 
 '["Dialog styling", "Button labels", "Status indication"]', NOW(), NOW()),

('TC-DOC-037: Verify Document Status Update Success', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Confirm status change", "2. Verify document status updates", "3. Check documents list"]', 
 'Document status should update successfully and be reflected in the list.', 
 '["Status persistence", "List refresh"]', NOW(), NOW()),

('TC-DOC-038: Verify Status Change Reflected in List', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Change document status", "2. Check documents list", "3. Verify status change is visible"]', 
 'Status change should be immediately visible in the documents list.', 
 '["Status indicators", "Visual feedback"]', NOW(), NOW()),

-- Error Handling Test Cases
('TC-DOC-039: Verify Error Handling for API Failures', 'Settings', 'Supporting Trip Docs', 'High', 
 '["1. Simulate API failure", "2. Perform document operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-DOC-040: Verify Form Validation Error Display', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-DOC-041: Verify File Upload Error Handling', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Try to upload invalid file", "2. Check error messages", "3. Verify upload error handling"]', 
 'File upload should handle errors gracefully with appropriate user feedback.', 
 '["File size errors", "File type errors", "Upload failures"]', NOW(), NOW()),

('TC-DOC-042: Verify Network Error Handling', 'Settings', 'Supporting Trip Docs', 'Medium', 
 '["1. Disconnect network", "2. Try to perform document operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
