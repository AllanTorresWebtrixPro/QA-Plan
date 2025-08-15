-- Settings Module - Company Section Testing
-- Test cases for Company Overview, Brands Management, and Lodges Management

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Company Overview Test Cases
('TC-COMP-001: Verify Company Page Load', 'Settings', 'Company', 'High', 
 '["1. Login as Admin user", "2. Navigate to Settings", "3. Click on Company section", "4. Verify page loads without errors"]', 
 'Company page should load successfully with all elements displayed correctly.', 
 '["Slow network connection", "Large data sets"]', NOW(), NOW()),

('TC-COMP-002: Verify Company Page Title', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Company settings page", "2. Check page title", "3. Verify title displays correctly"]', 
 'Page title should display "Company" or "Company Settings".', 
 '["Browser tab title", "Breadcrumb navigation"]', NOW(), NOW()),

('TC-COMP-003: Verify Statistics Cards Display', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Company settings page", "2. Look for statistics cards", "3. Verify Total Brands and Total Lodges cards are present"]', 
 'Statistics cards should display Total Brands and Total Lodges with accurate counts.', 
 '["Zero counts", "Large numbers", "Loading states"]', NOW(), NOW()),

('TC-COMP-004: Verify Tab Navigation', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Company settings page", "2. Click on Brands tab", "3. Click on Lodges tab", "4. Verify tab switching works"]', 
 'Tab navigation between Brands and Lodges should work smoothly with content updating accordingly.', 
 '["Tab highlighting", "Content persistence"]', NOW(), NOW()),

('TC-COMP-005: Verify Responsive Design', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Company settings page", "2. Test on mobile device or resize browser", "3. Verify layout adapts correctly"]', 
 'Page should be responsive and usable on mobile devices with proper layout adaptation.', 
 '["Tablet view", "Small mobile screens"]', NOW(), NOW()),

('TC-COMP-006: Verify Total Brands Count Accuracy', 'Settings', 'Company', 'High', 
 '["1. Navigate to Company settings page", "2. Note the Total Brands count", "3. Count actual brands in the list", "4. Compare counts"]', 
 'Total Brands count should match the actual number of brands in the system.', 
 '["Active vs inactive brands", "Filtered views"]', NOW(), NOW()),

('TC-COMP-007: Verify Total Lodges Count Accuracy', 'Settings', 'Company', 'High', 
 '["1. Navigate to Company settings page", "2. Note the Total Lodges count", "3. Count actual lodges in the list", "4. Compare counts"]', 
 'Total Lodges count should match the actual number of lodges in the system.', 
 '["Active vs inactive lodges", "Filtered views"]', NOW(), NOW()),

('TC-COMP-008: Verify Statistics Update', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Company settings page", "2. Note initial statistics", "3. Add a new brand", "4. Verify Total Brands count updates"]', 
 'Statistics should update automatically when data changes (add/delete brands/lodges).', 
 '["Real-time updates", "Cache refresh"]', NOW(), NOW()),

('TC-COMP-009: Verify Statistics Card Styling', 'Settings', 'Company', 'Low', 
 '["1. Navigate to Company settings page", "2. Check statistics cards styling", "3. Verify colors and layout"]', 
 'Statistics cards should have consistent styling with proper colors and layout.', 
 '["Dark mode", "High contrast mode"]', NOW(), NOW()),

-- Brands Management Test Cases
('TC-BRAND-001: Verify Brands List Display', 'Settings', 'Company', 'High', 
 '["1. Navigate to Company settings page", "2. Click on Brands tab", "3. Verify brands list loads and displays correctly"]', 
 'Brands list should load and display all brands with proper formatting and data.', 
 '["Empty list", "Large number of brands"]', NOW(), NOW()),

('TC-BRAND-002: Verify Brand Table Columns', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Brands tab", "2. Check table headers", "3. Verify all required columns are present"]', 
 'Brand table should show columns: Name, Address, Email, Phone, Website, Logo, Signature.', 
 '["Column sorting", "Column resizing"]', NOW(), NOW()),

('TC-BRAND-003: Verify Brand Search Functionality', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Brands tab", "2. Enter search term in search box", "3. Verify results are filtered"]', 
 'Search should filter brands based on entered search term (name, email, etc.).', 
 '["Partial matches", "Case sensitivity", "Special characters"]', NOW(), NOW()),

('TC-BRAND-004: Verify Empty State Display', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Brands tab", "2. Clear all brands (if possible)", "3. Verify empty state message"]', 
 'Empty state should display appropriate message when no brands exist.', 
 '["No results from search", "Initial empty state"]', NOW(), NOW()),

('TC-BRAND-005: Verify Loading Skeleton', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Brands tab", "2. Observe loading state", "3. Verify skeleton displays during data fetch"]', 
 'Loading skeleton should display while brands data is being fetched.', 
 '["Slow network", "Large data sets"]', NOW(), NOW()),

('TC-BRAND-006: Verify Add Brand Button', 'Settings', 'Company', 'High', 
 '["1. Navigate to Brands tab", "2. Click Add Brand button", "3. Verify dialog opens"]', 
 'Add Brand button should open a dialog with brand creation form.', 
 '["Button disabled state", "Multiple clicks"]', NOW(), NOW()),

('TC-BRAND-007: Verify Required Fields in Add Form', 'Settings', 'Company', 'High', 
 '["1. Open Add Brand dialog", "2. Check form fields", "3. Verify required fields are marked"]', 
 'Required fields (Name*, Address*, Email*, Phone*) should be clearly marked with asterisks.', 
 '["Field validation", "Form submission"]', NOW(), NOW()),

('TC-BRAND-008: Verify Optional Fields in Add Form', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Brand dialog", "2. Check form fields", "3. Verify optional fields are present"]', 
 'Optional fields (Website, Logo, Signature) should be present but not required.', 
 '["Field behavior", "Form validation"]', NOW(), NOW()),

('TC-BRAND-009: Verify Form Validation for Required Fields', 'Settings', 'Company', 'High', 
 '["1. Open Add Brand dialog", "2. Leave required fields empty", "3. Try to submit form", "4. Verify validation errors"]', 
 'Form should show validation errors for empty required fields and prevent submission.', 
 '["Multiple validation errors", "Field-specific messages"]', NOW(), NOW()),

('TC-BRAND-010: Verify Email Format Validation', 'Settings', 'Company', 'High', 
 '["1. Open Add Brand dialog", "2. Enter invalid email format", "3. Try to submit form", "4. Verify email validation"]', 
 'Form should validate email format and show error for invalid emails.', 
 '["Various invalid formats", "Valid email formats"]', NOW(), NOW()),

('TC-BRAND-011: Verify Phone Number Validation', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Brand dialog", "2. Enter invalid phone number", "3. Try to submit form", "4. Verify phone validation"]', 
 'Form should validate phone number format and show error for invalid numbers.', 
 '["International formats", "Special characters"]', NOW(), NOW()),

('TC-BRAND-012: Verify Logo Upload Functionality', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Brand dialog", "2. Click on logo upload field", "3. Select image file", "4. Verify upload works"]', 
 'Logo upload should accept image files and display preview.', 
 '["File size limits", "File type restrictions", "Upload progress"]', NOW(), NOW()),

('TC-BRAND-013: Verify Signature Upload Functionality', 'Settings', 'Company', 'Medium', 
 '["1. Open Add Brand dialog", "2. Click on signature upload field", "3. Select image file", "4. Verify upload works"]', 
 'Signature upload should accept image files and display preview.', 
 '["File size limits", "File type restrictions", "Upload progress"]', NOW(), NOW()),

('TC-BRAND-014: Verify Brand Creation Success', 'Settings', 'Company', 'High', 
 '["1. Open Add Brand dialog", "2. Fill all required fields", "3. Submit form", "4. Verify brand is created"]', 
 'Brand should be created successfully and appear in the brands list.', 
 '["Form data persistence", "Success feedback"]', NOW(), NOW()),

('TC-BRAND-015: Verify Success Toast Notification', 'Settings', 'Company', 'Medium', 
 '["1. Create a new brand", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear with appropriate message after brand creation.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-BRAND-016: Verify Dialog Close After Creation', 'Settings', 'Company', 'Medium', 
 '["1. Create a new brand successfully", "2. Verify dialog closes automatically", "3. Check page state"]', 
 'Dialog should close automatically after successful brand creation.', 
 '["Dialog state", "Page focus"]', NOW(), NOW()),

('TC-BRAND-017: Verify New Brand Appears in List', 'Settings', 'Company', 'High', 
 '["1. Create a new brand", "2. Check brands list", "3. Verify new brand is visible"]', 
 'Newly created brand should appear in the brands list immediately.', 
 '["List refresh", "Sorting order"]', NOW(), NOW()),

('TC-BRAND-018: Verify Edit Brand Button', 'Settings', 'Company', 'High', 
 '["1. Navigate to Brands tab", "2. Click edit button on a brand", "3. Verify edit dialog opens"]', 
 'Edit button should open dialog with pre-filled brand data.', 
 '["Data accuracy", "Form state"]', NOW(), NOW()),

('TC-BRAND-019: Verify Pre-filled Data in Edit Form', 'Settings', 'Company', 'High', 
 '["1. Open edit brand dialog", "2. Check form fields", "3. Verify all fields are pre-filled correctly"]', 
 'Edit form should display current brand data in all fields.', 
 '["Data consistency", "Field types"]', NOW(), NOW()),

('TC-BRAND-020: Verify All Fields Editable', 'Settings', 'Company', 'Medium', 
 '["1. Open edit brand dialog", "2. Try to edit each field", "3. Verify all fields are editable"]', 
 'All fields in edit form should be editable and allow changes.', 
 '["Field permissions", "Read-only fields"]', NOW(), NOW()),

('TC-BRAND-021: Verify Form Validation During Edit', 'Settings', 'Company', 'High', 
 '["1. Open edit brand dialog", "2. Clear required fields", "3. Try to submit", "4. Verify validation"]', 
 'Edit form should validate required fields and show errors for invalid data.', 
 '["Validation consistency", "Error messages"]', NOW(), NOW()),

('TC-BRAND-022: Verify Brand Update Success', 'Settings', 'Company', 'High', 
 '["1. Edit brand information", "2. Submit form", "3. Verify brand is updated"]', 
 'Brand should be updated successfully with new information.', 
 '["Data persistence", "List refresh"]', NOW(), NOW()),

('TC-BRAND-023: Verify Success Notification for Edit', 'Settings', 'Company', 'Medium', 
 '["1. Update brand information", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful brand update.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-BRAND-024: Verify Changes Reflected in List', 'Settings', 'Company', 'High', 
 '["1. Update brand information", "2. Check brands list", "3. Verify changes are visible"]', 
 'Updated brand information should be reflected in the brands list immediately.', 
 '["List refresh", "Data consistency"]', NOW(), NOW()),

('TC-BRAND-025: Verify Delete Brand Button', 'Settings', 'Company', 'High', 
 '["1. Navigate to Brands tab", "2. Click delete button on a brand", "3. Verify confirmation dialog opens"]', 
 'Delete button should open confirmation dialog with brand name.', 
 '["Dialog content", "Confirmation message"]', NOW(), NOW()),

('TC-BRAND-026: Verify Delete Confirmation Dialog', 'Settings', 'Company', 'Medium', 
 '["1. Open delete confirmation dialog", "2. Check dialog content", "3. Verify brand name is displayed"]', 
 'Confirmation dialog should show brand name and clear delete confirmation message.', 
 '["Dialog styling", "Button labels"]', NOW(), NOW()),

('TC-BRAND-027: Verify Brand Deletion Success', 'Settings', 'Company', 'High', 
 '["1. Confirm brand deletion", "2. Verify brand is deleted", "3. Check brands list"]', 
 'Brand should be deleted successfully and removed from the brands list.', 
 '["Data removal", "List update"]', NOW(), NOW()),

('TC-BRAND-028: Verify Success Notification for Delete', 'Settings', 'Company', 'Medium', 
 '["1. Delete a brand", "2. Verify success notification appears", "3. Check notification message"]', 
 'Success toast notification should appear after successful brand deletion.', 
 '["Notification timing", "Message content"]', NOW(), NOW()),

('TC-BRAND-029: Verify Brand Removed from List', 'Settings', 'Company', 'High', 
 '["1. Delete a brand", "2. Check brands list", "3. Verify brand is no longer visible"]', 
 'Deleted brand should be removed from the brands list immediately.', 
 '["List refresh", "Search results"]', NOW(), NOW()),

('TC-BRAND-030: Verify Statistics Update After Delete', 'Settings', 'Company', 'Medium', 
 '["1. Note initial Total Brands count", "2. Delete a brand", "3. Verify count decreases"]', 
 'Total Brands count should decrease by 1 after brand deletion.', 
 '["Count accuracy", "Real-time update"]', NOW(), NOW()),

('TC-BRAND-031: Verify View Brand Details', 'Settings', 'Company', 'Medium', 
 '["1. Navigate to Brands tab", "2. Click view button on a brand", "3. Verify details dialog opens"]', 
 'View button should open dialog showing all brand information.', 
 '["Data display", "Dialog content"]', NOW(), NOW()),

('TC-BRAND-032: Verify Brand Information Display', 'Settings', 'Company', 'Medium', 
 '["1. Open brand details dialog", "2. Check all brand information", "3. Verify data is displayed correctly"]', 
 'All brand information should be displayed correctly in the details dialog.', 
 '["Data accuracy", "Formatting"]', NOW(), NOW()),

('TC-BRAND-033: Verify Logo and Signature Display', 'Settings', 'Company', 'Medium', 
 '["1. Open brand details dialog", "2. Check logo and signature images", "3. Verify images display correctly"]', 
 'Logo and signature images should display correctly in the details dialog.', 
 '["Image loading", "Image quality", "Missing images"]', NOW(), NOW()),

('TC-BRAND-034: Verify Error Handling for API Failures', 'Settings', 'Company', 'High', 
 '["1. Simulate API failure", "2. Perform brand operation", "3. Verify error message displays"]', 
 'Error message should display when API operations fail.', 
 '["Network errors", "Server errors", "Timeout errors"]', NOW(), NOW()),

('TC-BRAND-035: Verify Form Validation Error Display', 'Settings', 'Company', 'Medium', 
 '["1. Submit form with invalid data", "2. Check error messages", "3. Verify errors are displayed correctly"]', 
 'Form validation errors should be displayed clearly and helpfully.', 
 '["Error styling", "Error positioning", "Multiple errors"]', NOW(), NOW()),

('TC-BRAND-036: Verify Network Error Handling', 'Settings', 'Company', 'Medium', 
 '["1. Disconnect network", "2. Try to perform brand operation", "3. Verify network error handling"]', 
 'Application should handle network errors gracefully with appropriate user feedback.', 
 '["Offline mode", "Connection recovery"]', NOW(), NOW());
