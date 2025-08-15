# Settings Module QA Plan

## Overview
This QA plan covers the complete Settings module of the MTP application, which is accessible only to Admin users (role_id = 1). The module contains various configuration sections for managing company data, users, payment methods, and system settings.

## Access Control Testing

### Test Cases for Access Control
1. **Admin Access Verification**
   - **TC-AC-001**: Verify that only users with role_id = 1 (Admin) can access Settings
   - **TC-AC-002**: Verify that Sales Representatives (role_id = 15) cannot see Settings link
   - **TC-AC-003**: Verify that Lodge Managers (role_id = 2) cannot access Settings
   - **TC-AC-004**: Verify that Clients (role_id = 6) cannot access Settings
   - **TC-AC-005**: Verify that unauthenticated users are redirected to login

2. **Navigation Testing**
   - **TC-NAV-001**: Verify Settings link appears in top menu for Admin users
   - **TC-NAV-002**: Verify Settings link is highlighted when on Settings pages
   - **TC-NAV-003**: Verify Settings sidebar navigation works correctly
   - **TC-NAV-004**: Verify direct URL access to Settings pages works for Admin users
   - **TC-NAV-005**: Verify Settings redirects to /settings/company by default

---

## 1. Company Section

### 1.1 Company Overview
**Location**: `/settings/company`

#### Test Cases for Company Overview
1. **Page Load and Display**
   - **TC-COMP-001**: Verify Company page loads without errors
   - **TC-COMP-002**: Verify page title displays "Company"
   - **TC-COMP-003**: Verify statistics cards display correctly (Total Brands, Total Lodges)
   - **TC-COMP-004**: Verify tab navigation between Brands and Lodges works
   - **TC-COMP-005**: Verify responsive design on mobile devices

2. **Statistics Cards**
   - **TC-COMP-006**: Verify Total Brands count is accurate
   - **TC-COMP-007**: Verify Total Lodges count is accurate
   - **TC-COMP-008**: Verify statistics update when data changes
   - **TC-COMP-009**: Verify cards have correct styling and colors

### 1.2 Brands Management
**Location**: `/settings/company` (Brands tab)

#### Test Cases for Brands CRUD Operations
1. **Brand List Display**
   - **TC-BRAND-001**: Verify brands list loads and displays correctly
   - **TC-BRAND-002**: Verify brand table shows all required columns (Name, Address, Email, Phone, Website, Logo, Signature)
   - **TC-BRAND-003**: Verify search functionality works for brand names
   - **TC-BRAND-004**: Verify empty state displays when no brands exist
   - **TC-BRAND-005**: Verify loading skeleton displays during data fetch

2. **Add New Brand**
   - **TC-BRAND-006**: Verify "Add Brand" button opens dialog
   - **TC-BRAND-007**: Verify all required fields are present (Name*, Address*, Email*, Phone*)
   - **TC-BRAND-008**: Verify optional fields are present (Website, Logo, Signature)
   - **TC-BRAND-009**: Verify form validation works for required fields
   - **TC-BRAND-010**: Verify email format validation works
   - **TC-BRAND-011**: Verify phone number format validation works
   - **TC-BRAND-012**: Verify logo upload functionality works
   - **TC-BRAND-013**: Verify signature upload functionality works
   - **TC-BRAND-014**: Verify brand is created successfully
   - **TC-BRAND-015**: Verify success toast notification appears
   - **TC-BRAND-016**: Verify dialog closes after successful creation
   - **TC-BRAND-017**: Verify new brand appears in the list

3. **Edit Brand**
   - **TC-BRAND-018**: Verify edit button opens dialog with pre-filled data
   - **TC-BRAND-019**: Verify all fields are editable
   - **TC-BRAND-020**: Verify form validation works during edit
   - **TC-BRAND-021**: Verify brand is updated successfully
   - **TC-BRAND-022**: Verify success toast notification appears
   - **TC-BRAND-023**: Verify changes are reflected in the list

4. **Delete Brand**
   - **TC-BRAND-024**: Verify delete button opens confirmation dialog
   - **TC-BRAND-025**: Verify confirmation dialog shows brand name
   - **TC-BRAND-026**: Verify brand is deleted successfully
   - **TC-BRAND-027**: Verify success toast notification appears
   - **TC-BRAND-028**: Verify brand is removed from the list
   - **TC-BRAND-029**: Verify statistics card updates after deletion

5. **View Brand Details**
   - **TC-BRAND-030**: Verify view button opens details dialog
   - **TC-BRAND-031**: Verify all brand information is displayed correctly
   - **TC-BRAND-032**: Verify logo and signature images display correctly

6. **Error Handling**
   - **TC-BRAND-033**: Verify error message displays when API fails
   - **TC-BRAND-034**: Verify form validation errors display correctly
   - **TC-BRAND-035**: Verify network error handling works

### 1.3 Lodges Management
**Location**: `/settings/company` (Lodges tab)

#### Test Cases for Lodges CRUD Operations
1. **Lodge List Display**
   - **TC-LODGE-001**: Verify lodges list loads and displays correctly
   - **TC-LODGE-002**: Verify lodge table shows all required columns (Brand, Name, Type, Logo, Address, Phone, Description, Supporting Docs)
   - **TC-LODGE-003**: Verify search functionality works for lodge names
   - **TC-LODGE-004**: Verify filter by brand works correctly
   - **TC-LODGE-005**: Verify empty state displays when no lodges exist
   - **TC-LODGE-006**: Verify loading skeleton displays during data fetch

2. **Add New Lodge**
   - **TC-LODGE-007**: Verify "Add Lodge" button opens dialog
   - **TC-LODGE-008**: Verify brand selection dropdown works
   - **TC-LODGE-009**: Verify all required fields are present (Brand*, Name*, Type*, Address*, Phone*)
   - **TC-LODGE-010**: Verify optional fields are present (Logo, Description, Supporting Docs)
   - **TC-LODGE-011**: Verify lodge types are correct (Hunting, Fishing, Big Game)
   - **TC-LODGE-012**: Verify form validation works for required fields
   - **TC-LODGE-013**: Verify phone number format validation works
   - **TC-LODGE-014**: Verify logo upload functionality works
   - **TC-LODGE-015**: Verify supporting docs selection works
   - **TC-LODGE-016**: Verify lodge is created successfully
   - **TC-LODGE-017**: Verify success toast notification appears
   - **TC-LODGE-018**: Verify dialog closes after successful creation
   - **TC-LODGE-019**: Verify new lodge appears in the list

3. **Edit Lodge**
   - **TC-LODGE-020**: Verify edit button opens dialog with pre-filled data
   - **TC-LODGE-021**: Verify all fields are editable
   - **TC-LODGE-022**: Verify brand selection updates correctly
   - **TC-LODGE-023**: Verify form validation works during edit
   - **TC-LODGE-024**: Verify lodge is updated successfully
   - **TC-LODGE-025**: Verify success toast notification appears
   - **TC-LODGE-026**: Verify changes are reflected in the list

4. **Delete Lodge**
   - **TC-LODGE-027**: Verify delete button opens confirmation dialog
   - **TC-LODGE-028**: Verify confirmation dialog shows lodge name
   - **TC-LODGE-029**: Verify lodge is deleted successfully
   - **TC-LODGE-030**: Verify success toast notification appears
   - **TC-LODGE-031**: Verify lodge is removed from the list
   - **TC-LODGE-032**: Verify statistics card updates after deletion

5. **View Lodge Details**
   - **TC-LODGE-033**: Verify view button opens details dialog
   - **TC-LODGE-034**: Verify all lodge information is displayed correctly
   - **TC-LODGE-035**: Verify logo image displays correctly
   - **TC-LODGE-036**: Verify supporting docs are listed correctly

6. **Error Handling**
   - **TC-LODGE-037**: Verify error message displays when API fails
   - **TC-LODGE-038**: Verify form validation errors display correctly
   - **TC-LODGE-039**: Verify network error handling works

---

## 2. Users Section

### 2.1 Users Management
**Location**: `/settings/users`

#### Test Cases for Users CRUD Operations
1. **Users List Display**
   - **TC-USER-001**: Verify users list loads and displays correctly
   - **TC-USER-002**: Verify user table shows all required columns (Name, Email, Role, Status, Actions)
   - **TC-USER-003**: Verify search functionality works for user names and emails
   - **TC-USER-004**: Verify role filter works correctly (Admin, Lodge Manager)
   - **TC-USER-005**: Verify status filter works correctly (Active, Inactive)
   - **TC-USER-006**: Verify empty state displays when no users exist
   - **TC-USER-007**: Verify loading skeleton displays during data fetch

2. **Add New User**
   - **TC-USER-008**: Verify "Add User" button opens dialog
   - **TC-USER-009**: Verify all required fields are present (First Name*, Last Name*, Email*, Password*, Role*)
   - **TC-USER-010**: Verify role selection dropdown works (Admin, Lodge Manager)
   - **TC-USER-011**: Verify form validation works for required fields
   - **TC-USER-012**: Verify email format validation works
   - **TC-USER-013**: Verify password strength validation works
   - **TC-USER-014**: Verify user is created successfully
   - **TC-USER-015**: Verify success toast notification appears
   - **TC-USER-016**: Verify dialog closes after successful creation
   - **TC-USER-017**: Verify new user appears in the list

3. **Edit User**
   - **TC-USER-018**: Verify edit button opens dialog with pre-filled data
   - **TC-USER-019**: Verify all fields are editable
   - **TC-USER-020**: Verify role can be changed
   - **TC-USER-021**: Verify form validation works during edit
   - **TC-USER-022**: Verify user is updated successfully
   - **TC-USER-023**: Verify success toast notification appears
   - **TC-USER-024**: Verify changes are reflected in the list

4. **Delete User**
   - **TC-USER-025**: Verify delete button opens confirmation dialog
   - **TC-USER-026**: Verify confirmation dialog shows user name
   - **TC-USER-027**: Verify user is deleted successfully
   - **TC-USER-028**: Verify success toast notification appears
   - **TC-USER-029**: Verify user is removed from the list

5. **User Status Management**
   - **TC-USER-030**: Verify status toggle button works
   - **TC-USER-031**: Verify status change confirmation dialog appears
   - **TC-USER-032**: Verify user status updates successfully
   - **TC-USER-033**: Verify status change is reflected in the list

6. **Password Reset**
   - **TC-USER-034**: Verify "Reset Password" button works
   - **TC-USER-035**: Verify password reset confirmation dialog appears
   - **TC-USER-036**: Verify password reset email is sent
   - **TC-USER-037**: Verify success toast notification appears

7. **Access Settings**
   - **TC-USER-038**: Verify "Access Settings" button opens dialog
   - **TC-USER-039**: Verify brand and lodge access can be configured
   - **TC-USER-040**: Verify access settings are saved successfully
   - **TC-USER-041**: Verify access settings are applied correctly

8. **Error Handling**
   - **TC-USER-042**: Verify error message displays when API fails
   - **TC-USER-043**: Verify form validation errors display correctly
   - **TC-USER-044**: Verify network error handling works

---

## 3. Payment Methods Section

### 3.1 Payment Methods Management
**Location**: `/settings/payment-methods`

#### Test Cases for Payment Methods
1. **Payment Methods List Display**
   - **TC-PAY-001**: Verify payment methods list loads and displays correctly
   - **TC-PAY-002**: Verify payment methods table shows all required columns (Name, Type, Status, Actions)
   - **TC-PAY-003**: Verify search functionality works for payment method names
   - **TC-PAY-004**: Verify status filter works correctly (Active, Inactive)
   - **TC-PAY-005**: Verify empty state displays when no payment methods exist
   - **TC-PAY-006**: Verify loading skeleton displays during data fetch

2. **Add New Payment Method**
   - **TC-PAY-007**: Verify "Add Payment Method" button opens dialog
   - **TC-PAY-008**: Verify all required fields are present (Name*, Type*)
   - **TC-PAY-009**: Verify payment method types are correct (Credit Card, Bank Transfer, etc.)
   - **TC-PAY-010**: Verify form validation works for required fields
   - **TC-PAY-011**: Verify payment method is created successfully
   - **TC-PAY-012**: Verify success toast notification appears
   - **TC-PAY-013**: Verify dialog closes after successful creation
   - **TC-PAY-014**: Verify new payment method appears in the list

3. **Edit Payment Method**
   - **TC-PAY-015**: Verify edit button opens dialog with pre-filled data
   - **TC-PAY-016**: Verify all fields are editable
   - **TC-PAY-017**: Verify form validation works during edit
   - **TC-PAY-018**: Verify payment method is updated successfully
   - **TC-PAY-019**: Verify success toast notification appears
   - **TC-PAY-020**: Verify changes are reflected in the list

4. **Delete Payment Method**
   - **TC-PAY-021**: Verify delete button opens confirmation dialog
   - **TC-PAY-022**: Verify confirmation dialog shows payment method name
   - **TC-PAY-023**: Verify payment method is deleted successfully
   - **TC-PAY-024**: Verify success toast notification appears
   - **TC-PAY-025**: Verify payment method is removed from the list

5. **Status Management**
   - **TC-PAY-026**: Verify status toggle button works
   - **TC-PAY-027**: Verify status change confirmation dialog appears
   - **TC-PAY-028**: Verify payment method status updates successfully
   - **TC-PAY-029**: Verify status change is reflected in the list

6. **Error Handling**
   - **TC-PAY-030**: Verify error message displays when API fails
   - **TC-PAY-031**: Verify form validation errors display correctly
   - **TC-PAY-032**: Verify network error handling works

---

## 4. Invoice Items Section

### 4.1 Invoice Items Management
**Location**: `/settings/invoice-items`

#### Test Cases for Invoice Items
1. **Invoice Items List Display**
   - **TC-INV-001**: Verify invoice items list loads and displays correctly
   - **TC-INV-002**: Verify items are grouped by label correctly
   - **TC-INV-003**: Verify expandable/collapsible groups work
   - **TC-INV-004**: Verify search functionality works for item names and labels
   - **TC-INV-005**: Verify empty state displays when no items exist
   - **TC-INV-006**: Verify loading skeleton displays during data fetch

2. **Add New Invoice Item**
   - **TC-INV-007**: Verify "Add Item" button opens dialog
   - **TC-INV-008**: Verify all required fields are present (Label*, Name*, Price*)
   - **TC-INV-009**: Verify price field accepts numeric values
   - **TC-INV-010**: Verify form validation works for required fields
   - **TC-INV-011**: Verify invoice item is created successfully
   - **TC-INV-012**: Verify success toast notification appears
   - **TC-INV-013**: Verify dialog closes after successful creation
   - **TC-INV-014**: Verify new item appears in the correct group

3. **Edit Invoice Item**
   - **TC-INV-015**: Verify edit button opens dialog with pre-filled data
   - **TC-INV-016**: Verify all fields are editable
   - **TC-INV-017**: Verify form validation works during edit
   - **TC-INV-018**: Verify invoice item is updated successfully
   - **TC-INV-019**: Verify success toast notification appears
   - **TC-INV-020**: Verify changes are reflected in the list

4. **Delete Invoice Item**
   - **TC-INV-021**: Verify delete button opens confirmation dialog
   - **TC-INV-022**: Verify confirmation dialog shows item name
   - **TC-INV-023**: Verify invoice item is deleted successfully
   - **TC-INV-024**: Verify success toast notification appears
   - **TC-INV-025**: Verify item is removed from the list

5. **Status Management**
   - **TC-INV-026**: Verify status toggle button works
   - **TC-INV-027**: Verify status change confirmation dialog appears
   - **TC-INV-028**: Verify item status updates successfully
   - **TC-INV-029**: Verify status change is reflected in the list

6. **Group Management**
   - **TC-INV-030**: Verify groups can be expanded/collapsed
   - **TC-INV-031**: Verify items are properly grouped by label
   - **TC-INV-032**: Verify group headers show correct counts

7. **Error Handling**
   - **TC-INV-033**: Verify error message displays when API fails
   - **TC-INV-034**: Verify form validation errors display correctly
   - **TC-INV-035**: Verify network error handling works

---

## 5. Travel Insurance Section

### 5.1 Travel Insurance Management
**Location**: `/settings/trip-insurance`

#### Test Cases for Travel Insurance
1. **Insurance List Display**
   - **TC-INS-001**: Verify insurance list loads and displays correctly
   - **TC-INS-002**: Verify insurance table shows all required columns (Name, Provider, Coverage, Price, Status)
   - **TC-INS-003**: Verify search functionality works for insurance names
   - **TC-INS-004**: Verify status filter works correctly (Active, Inactive)
   - **TC-INS-005**: Verify empty state displays when no insurance options exist
   - **TC-INS-006**: Verify loading skeleton displays during data fetch

2. **Add New Insurance**
   - **TC-INS-007**: Verify "Add Insurance" button opens dialog
   - **TC-INS-008**: Verify all required fields are present (Name*, Provider*, Coverage*, Price*)
   - **TC-INS-009**: Verify price field accepts numeric values
   - **TC-INS-010**: Verify form validation works for required fields
   - **TC-INS-011**: Verify insurance is created successfully
   - **TC-INS-012**: Verify success toast notification appears
   - **TC-INS-013**: Verify dialog closes after successful creation
   - **TC-INS-014**: Verify new insurance appears in the list

3. **Edit Insurance**
   - **TC-INS-015**: Verify edit button opens dialog with pre-filled data
   - **TC-INS-016**: Verify all fields are editable
   - **TC-INS-017**: Verify form validation works during edit
   - **TC-INS-018**: Verify insurance is updated successfully
   - **TC-INS-019**: Verify success toast notification appears
   - **TC-INS-020**: Verify changes are reflected in the list

4. **Delete Insurance**
   - **TC-INS-021**: Verify delete button opens confirmation dialog
   - **TC-INS-022**: Verify confirmation dialog shows insurance name
   - **TC-INS-023**: Verify insurance is deleted successfully
   - **TC-INS-024**: Verify success toast notification appears
   - **TC-INS-025**: Verify insurance is removed from the list

5. **Status Management**
   - **TC-INS-026**: Verify status toggle button works
   - **TC-INS-027**: Verify status change confirmation dialog appears
   - **TC-INS-028**: Verify insurance status updates successfully
   - **TC-INS-029**: Verify status change is reflected in the list

6. **Error Handling**
   - **TC-INS-030**: Verify error message displays when API fails
   - **TC-INS-031**: Verify form validation errors display correctly
   - **TC-INS-032**: Verify network error handling works

---

## 6. Terms and Conditions Section

### 6.1 Terms and Conditions Management
**Location**: `/settings/terms-conditions`

#### Test Cases for Terms and Conditions
1. **Terms List Display**
   - **TC-TERM-001**: Verify terms list loads and displays correctly
   - **TC-TERM-002**: Verify terms table shows all required columns (Title, Brand, Status, Last Updated, Actions)
   - **TC-TERM-003**: Verify search functionality works for terms titles
   - **TC-TERM-004**: Verify brand filter works correctly
   - **TC-TERM-005**: Verify status filter works correctly (Active, Inactive)
   - **TC-TERM-006**: Verify empty state displays when no terms exist
   - **TC-TERM-007**: Verify loading skeleton displays during data fetch

2. **Add New Terms**
   - **TC-TERM-008**: Verify "Add Terms" button opens dialog
   - **TC-TERM-009**: Verify all required fields are present (Title*, Brand*, Content*)
   - **TC-TERM-010**: Verify brand selection dropdown works
   - **TC-TERM-011**: Verify rich text editor works for content
   - **TC-TERM-012**: Verify form validation works for required fields
   - **TC-TERM-013**: Verify terms are created successfully
   - **TC-TERM-014**: Verify success toast notification appears
   - **TC-TERM-015**: Verify dialog closes after successful creation
   - **TC-TERM-016**: Verify new terms appear in the list

3. **Edit Terms**
   - **TC-TERM-017**: Verify edit button opens dialog with pre-filled data
   - **TC-TERM-018**: Verify all fields are editable
   - **TC-TERM-019**: Verify rich text editor loads existing content
   - **TC-TERM-020**: Verify form validation works during edit
   - **TC-TERM-021**: Verify terms are updated successfully
   - **TC-TERM-022**: Verify success toast notification appears
   - **TC-TERM-023**: Verify changes are reflected in the list

4. **Delete Terms**
   - **TC-TERM-024**: Verify delete button opens confirmation dialog
   - **TC-TERM-025**: Verify confirmation dialog shows terms title
   - **TC-TERM-026**: Verify terms are deleted successfully
   - **TC-TERM-027**: Verify success toast notification appears
   - **TC-TERM-028**: Verify terms are removed from the list

5. **Status Management**
   - **TC-TERM-029**: Verify status toggle button works
   - **TC-TERM-030**: Verify status change confirmation dialog appears
   - **TC-TERM-031**: Verify terms status updates successfully
   - **TC-TERM-032**: Verify status change is reflected in the list

6. **Preview Terms**
   - **TC-TERM-033**: Verify preview button opens terms in new tab/window
   - **TC-TERM-034**: Verify terms display correctly in preview
   - **TC-TERM-035**: Verify formatting is preserved in preview

7. **Error Handling**
   - **TC-TERM-036**: Verify error message displays when API fails
   - **TC-TERM-037**: Verify form validation errors display correctly
   - **TC-TERM-038**: Verify network error handling works

---

## 7. Supporting Trip Docs Section

### 7.1 Supporting Trip Docs Management
**Location**: `/settings/supporting-trip-docs`

#### Test Cases for Supporting Trip Docs
1. **Docs List Display**
   - **TC-DOC-001**: Verify docs list loads and displays correctly
   - **TC-DOC-002**: Verify docs table shows all required columns (Name, Type, Brand, Lodge, Status, Actions)
   - **TC-DOC-003**: Verify search functionality works for doc names
   - **TC-DOC-004**: Verify brand filter works correctly
   - **TC-DOC-005**: Verify lodge filter works correctly
   - **TC-DOC-006**: Verify status filter works correctly (Active, Inactive)
   - **TC-DOC-007**: Verify empty state displays when no docs exist
   - **TC-DOC-008**: Verify loading skeleton displays during data fetch

2. **Add New Doc**
   - **TC-DOC-009**: Verify "Add Doc" button opens dialog
   - **TC-DOC-010**: Verify all required fields are present (Name*, Type*, Brand*, Lodge*)
   - **TC-DOC-011**: Verify brand selection dropdown works
   - **TC-DOC-012**: Verify lodge selection updates based on brand
   - **TC-DOC-013**: Verify file upload functionality works
   - **TC-DOC-014**: Verify form validation works for required fields
   - **TC-DOC-015**: Verify doc is created successfully
   - **TC-DOC-016**: Verify success toast notification appears
   - **TC-DOC-017**: Verify dialog closes after successful creation
   - **TC-DOC-018**: Verify new doc appears in the list

3. **Edit Doc**
   - **TC-DOC-019**: Verify edit button opens dialog with pre-filled data
   - **TC-DOC-020**: Verify all fields are editable
   - **TC-DOC-021**: Verify file can be replaced
   - **TC-DOC-022**: Verify form validation works during edit
   - **TC-DOC-023**: Verify doc is updated successfully
   - **TC-DOC-024**: Verify success toast notification appears
   - **TC-DOC-025**: Verify changes are reflected in the list

4. **Delete Doc**
   - **TC-DOC-026**: Verify delete button opens confirmation dialog
   - **TC-DOC-027**: Verify confirmation dialog shows doc name
   - **TC-DOC-028**: Verify doc is deleted successfully
   - **TC-DOC-029**: Verify success toast notification appears
   - **TC-DOC-030**: Verify doc is removed from the list

5. **Download Doc**
   - **TC-DOC-031**: Verify download button works
   - **TC-DOC-032**: Verify file downloads correctly
   - **TC-DOC-033**: Verify file name is preserved

6. **Status Management**
   - **TC-DOC-034**: Verify status toggle button works
   - **TC-DOC-035**: Verify status change confirmation dialog appears
   - **TC-DOC-036**: Verify doc status updates successfully
   - **TC-DOC-037**: Verify status change is reflected in the list

7. **Error Handling**
   - **TC-DOC-038**: Verify error message displays when API fails
   - **TC-DOC-039**: Verify form validation errors display correctly
   - **TC-DOC-040**: Verify file upload error handling works
   - **TC-DOC-041**: Verify network error handling works

---

## 8. Surveys Section

### 8.1 Surveys Management
**Location**: `/settings/surveys`

#### Test Cases for Surveys
1. **Surveys List Display**
   - **TC-SURV-001**: Verify surveys list loads and displays correctly
   - **TC-SURV-002**: Verify surveys table shows all required columns (Title, Brand, Status, Questions Count, Responses Count, Actions)
   - **TC-SURV-003**: Verify search functionality works for survey titles
   - **TC-SURV-004**: Verify brand filter works correctly
   - **TC-SURV-005**: Verify status filter works correctly (Active, Inactive, Draft)
   - **TC-SURV-006**: Verify empty state displays when no surveys exist
   - **TC-SURV-007**: Verify loading skeleton displays during data fetch

2. **Add New Survey**
   - **TC-SURV-008**: Verify "Add Survey" button opens dialog
   - **TC-SURV-009**: Verify all required fields are present (Title*, Brand*, Description)
   - **TC-SURV-010**: Verify brand selection dropdown works
   - **TC-SURV-011**: Verify form validation works for required fields
   - **TC-SURV-012**: Verify survey is created successfully
   - **TC-SURV-013**: Verify success toast notification appears
   - **TC-SURV-014**: Verify dialog closes after successful creation
   - **TC-SURV-015**: Verify new survey appears in the list

3. **Edit Survey**
   - **TC-SURV-016**: Verify edit button opens dialog with pre-filled data
   - **TC-SURV-017**: Verify all fields are editable
   - **TC-SURV-018**: Verify form validation works during edit
   - **TC-SURV-019**: Verify survey is updated successfully
   - **TC-SURV-020**: Verify success toast notification appears
   - **TC-SURV-021**: Verify changes are reflected in the list

4. **Delete Survey**
   - **TC-SURV-022**: Verify delete button opens confirmation dialog
   - **TC-SURV-023**: Verify confirmation dialog shows survey title
   - **TC-SURV-024**: Verify survey is deleted successfully
   - **TC-SURV-025**: Verify success toast notification appears
   - **TC-SURV-026**: Verify survey is removed from the list

5. **Survey Questions Management**
   - **TC-SURV-027**: Verify "Manage Questions" button opens questions page
   - **TC-SURV-028**: Verify questions can be added to survey
   - **TC-SURV-029**: Verify questions can be reordered
   - **TC-SURV-030**: Verify questions can be edited
   - **TC-SURV-031**: Verify questions can be deleted

6. **Survey Responses**
   - **TC-SURV-032**: Verify "View Responses" button opens responses page
   - **TC-SURV-033**: Verify responses are displayed correctly
   - **TC-SURV-034**: Verify responses can be exported

7. **Status Management**
   - **TC-SURV-035**: Verify status toggle button works
   - **TC-SURV-036**: Verify status change confirmation dialog appears
   - **TC-SURV-037**: Verify survey status updates successfully
   - **TC-SURV-038**: Verify status change is reflected in the list

8. **Error Handling**
   - **TC-SURV-039**: Verify error message displays when API fails
   - **TC-SURV-040**: Verify form validation errors display correctly
   - **TC-SURV-041**: Verify network error handling works

---

## 9. Email Templates Section

### 9.1 Email Templates Management
**Location**: `/settings/notification-templates`

#### Test Cases for Email Templates
1. **Templates List Display**
   - **TC-TEMP-001**: Verify templates list loads and displays correctly
   - **TC-TEMP-002**: Verify templates table shows all required columns (Name, Type, Brand, Status, Last Updated, Actions)
   - **TC-TEMP-003**: Verify search functionality works for template names
   - **TC-TEMP-004**: Verify type filter works correctly
   - **TC-TEMP-005**: Verify brand filter works correctly
   - **TC-TEMP-006**: Verify status filter works correctly (Active, Inactive)
   - **TC-TEMP-007**: Verify empty state displays when no templates exist
   - **TC-TEMP-008**: Verify loading skeleton displays during data fetch

2. **Add New Template**
   - **TC-TEMP-009**: Verify "Add Template" button opens dialog
   - **TC-TEMP-010**: Verify all required fields are present (Name*, Type*, Brand*, Subject*, Content*)
   - **TC-TEMP-011**: Verify type selection dropdown works
   - **TC-TEMP-012**: Verify brand selection dropdown works
   - **TC-TEMP-013**: Verify rich text editor works for content
   - **TC-TEMP-014**: Verify form validation works for required fields
   - **TC-TEMP-015**: Verify template is created successfully
   - **TC-TEMP-016**: Verify success toast notification appears
   - **TC-TEMP-017**: Verify dialog closes after successful creation
   - **TC-TEMP-018**: Verify new template appears in the list

3. **Edit Template**
   - **TC-TEMP-019**: Verify edit button opens dialog with pre-filled data
   - **TC-TEMP-020**: Verify all fields are editable
   - **TC-TEMP-021**: Verify rich text editor loads existing content
   - **TC-TEMP-022**: Verify form validation works during edit
   - **TC-TEMP-023**: Verify template is updated successfully
   - **TC-TEMP-024**: Verify success toast notification appears
   - **TC-TEMP-025**: Verify changes are reflected in the list

4. **Delete Template**
   - **TC-TEMP-026**: Verify delete button opens confirmation dialog
   - **TC-TEMP-027**: Verify confirmation dialog shows template name
   - **TC-TEMP-028**: Verify template is deleted successfully
   - **TC-TEMP-029**: Verify success toast notification appears
   - **TC-TEMP-030**: Verify template is removed from the list

5. **Preview Template**
   - **TC-TEMP-031**: Verify preview button opens template preview
   - **TC-TEMP-032**: Verify template displays correctly in preview
   - **TC-TEMP-033**: Verify formatting is preserved in preview

6. **Test Template**
   - **TC-TEMP-034**: Verify test button opens test dialog
   - **TC-TEMP-035**: Verify test email can be sent
   - **TC-TEMP-036**: Verify test email contains template content

7. **Status Management**
   - **TC-TEMP-037**: Verify status toggle button works
   - **TC-TEMP-038**: Verify status change confirmation dialog appears
   - **TC-TEMP-039**: Verify template status updates successfully
   - **TC-TEMP-040**: Verify status change is reflected in the list

8. **Error Handling**
   - **TC-TEMP-041**: Verify error message displays when API fails
   - **TC-TEMP-042**: Verify form validation errors display correctly
   - **TC-TEMP-043**: Verify network error handling works

---

## 10. Email Notifications Section

### 10.1 Email Notifications Management
**Location**: `/settings/email-notifications`

#### Test Cases for Email Notifications
1. **Notifications List Display**
   - **TC-NOTIF-001**: Verify notifications list loads and displays correctly
   - **TC-NOTIF-002**: Verify notifications table shows all required columns (Event, Recipients, Template, Status, Actions)
   - **TC-NOTIF-003**: Verify search functionality works for event names
   - **TC-NOTIF-004**: Verify status filter works correctly (Enabled, Disabled)
   - **TC-NOTIF-005**: Verify empty state displays when no notifications exist
   - **TC-NOTIF-006**: Verify loading skeleton displays during data fetch

2. **Configure Notification**
   - **TC-NOTIF-007**: Verify "Configure" button opens dialog
   - **TC-NOTIF-008**: Verify all required fields are present (Event*, Recipients*, Template*)
   - **TC-NOTIF-009**: Verify recipient selection works (Admin, Client, Lodge Manager)
   - **TC-NOTIF-010**: Verify template selection dropdown works
   - **TC-NOTIF-011**: Verify form validation works for required fields
   - **TC-NOTIF-012**: Verify notification is configured successfully
   - **TC-NOTIF-013**: Verify success toast notification appears
   - **TC-NOTIF-014**: Verify dialog closes after successful configuration
   - **TC-NOTIF-015**: Verify configuration is reflected in the list

3. **Edit Notification**
   - **TC-NOTIF-016**: Verify edit button opens dialog with pre-filled data
   - **TC-NOTIF-017**: Verify all fields are editable
   - **TC-NOTIF-018**: Verify form validation works during edit
   - **TC-NOTIF-019**: Verify notification is updated successfully
   - **TC-NOTIF-020**: Verify success toast notification appears
   - **TC-NOTIF-021**: Verify changes are reflected in the list

4. **Enable/Disable Notification**
   - **TC-NOTIF-022**: Verify toggle button works
   - **TC-NOTIF-023**: Verify status change confirmation dialog appears
   - **TC-NOTIF-024**: Verify notification status updates successfully
   - **TC-NOTIF-025**: Verify status change is reflected in the list

5. **Test Notification**
   - **TC-NOTIF-026**: Verify test button opens test dialog
   - **TC-NOTIF-027**: Verify test email can be sent
   - **TC-NOTIF-028**: Verify test email uses correct template

6. **Error Handling**
   - **TC-NOTIF-029**: Verify error message displays when API fails
   - **TC-NOTIF-030**: Verify form validation errors display correctly
   - **TC-NOTIF-031**: Verify network error handling works

---

## Cross-Section Testing

### Test Cases for Cross-Section Functionality
1. **Navigation Between Sections**
   - **TC-CROSS-001**: Verify navigation between all settings sections works
   - **TC-CROSS-002**: Verify sidebar highlights current section correctly
   - **TC-CROSS-003**: Verify breadcrumb navigation works
   - **TC-CROSS-004**: Verify browser back/forward buttons work correctly

2. **Data Consistency**
   - **TC-CROSS-005**: Verify brand selection is consistent across all sections
   - **TC-CROSS-006**: Verify lodge selection updates based on brand selection
   - **TC-CROSS-007**: Verify user role permissions are consistent
   - **TC-CROSS-008**: Verify status changes are reflected across sections

3. **Search and Filter Consistency**
   - **TC-CROSS-009**: Verify search functionality works consistently across sections
   - **TC-CROSS-010**: Verify filter options are consistent
   - **TC-CROSS-011**: Verify pagination works consistently

4. **Error Handling Consistency**
   - **TC-CROSS-012**: Verify error messages are consistent across sections
   - **TC-CROSS-013**: Verify loading states are consistent
   - **TC-CROSS-014**: Verify toast notifications are consistent

---

## Performance Testing

### Test Cases for Performance
1. **Page Load Performance**
   - **TC-PERF-001**: Verify settings pages load within 3 seconds
   - **TC-PERF-002**: Verify large data sets load without freezing
   - **TC-PERF-003**: Verify search functionality is responsive
   - **TC-PERF-004**: Verify CRUD operations complete within 2 seconds

2. **Memory Usage**
   - **TC-PERF-005**: Verify no memory leaks during extended use
   - **TC-PERF-006**: Verify large lists don't cause performance degradation
   - **TC-PERF-007**: Verify file uploads don't consume excessive memory

3. **Network Performance**
   - **TC-PERF-008**: Verify API calls are optimized
   - **TC-PERF-009**: Verify file uploads are efficient
   - **TC-PERF-010**: Verify data caching works correctly

---

## Security Testing

### Test Cases for Security
1. **Authentication and Authorization**
   - **TC-SEC-001**: Verify only Admin users can access Settings
   - **TC-SEC-002**: Verify API endpoints require proper authentication
   - **TC-SEC-003**: Verify CSRF protection is in place
   - **TC-SEC-004**: Verify session timeout works correctly

2. **Input Validation**
   - **TC-SEC-005**: Verify SQL injection prevention
   - **TC-SEC-006**: Verify XSS prevention
   - **TC-SEC-007**: Verify file upload security
   - **TC-SEC-008**: Verify input sanitization

3. **Data Protection**
   - **TC-SEC-009**: Verify sensitive data is encrypted
   - **TC-SEC-010**: Verify audit logs are maintained
   - **TC-SEC-011**: Verify data backup and recovery

---

## Browser Compatibility Testing

### Test Cases for Browser Compatibility
1. **Desktop Browsers**
   - **TC-BROWSER-001**: Verify functionality works in Chrome (latest)
   - **TC-BROWSER-002**: Verify functionality works in Firefox (latest)
   - **TC-BROWSER-003**: Verify functionality works in Safari (latest)
   - **TC-BROWSER-004**: Verify functionality works in Edge (latest)

2. **Mobile Browsers**
   - **TC-BROWSER-005**: Verify responsive design works on mobile Chrome
   - **TC-BROWSER-006**: Verify responsive design works on mobile Safari
   - **TC-BROWSER-007**: Verify touch interactions work correctly
   - **TC-BROWSER-008**: Verify mobile navigation works

---

## Accessibility Testing

### Test Cases for Accessibility
1. **WCAG Compliance**
   - **TC-A11Y-001**: Verify keyboard navigation works
   - **TC-A11Y-002**: Verify screen reader compatibility
   - **TC-A11Y-003**: Verify color contrast meets standards
   - **TC-A11Y-004**: Verify focus indicators are visible
   - **TC-A11Y-005**: Verify alt text for images
   - **TC-A11Y-006**: Verify form labels are properly associated

---

## Test Execution Guidelines

### Test Environment Setup
1. **Required Test Data**
   - Admin user account (role_id = 1)
   - Sample brands, lodges, users, and other entities
   - Test files for upload functionality
   - Sample email templates

2. **Test Tools**
   - Browser developer tools for debugging
   - Network monitoring tools
   - Performance monitoring tools
   - Accessibility testing tools

3. **Test Execution Order**
   - Start with access control testing
   - Proceed with functional testing by section
   - Perform cross-section testing
   - Execute performance and security testing
   - Complete with browser compatibility and accessibility testing

### Bug Reporting
1. **Bug Report Template**
   - **Title**: Clear, concise description
   - **Severity**: Critical, High, Medium, Low
   - **Steps to Reproduce**: Detailed step-by-step instructions
   - **Expected Result**: What should happen
   - **Actual Result**: What actually happens
   - **Environment**: Browser, OS, user role
   - **Screenshots**: Visual evidence when applicable

### Test Completion Criteria
1. **All test cases must be executed**
2. **All critical and high severity bugs must be fixed**
3. **Performance benchmarks must be met**
4. **Security requirements must be satisfied**
5. **Accessibility standards must be met**

---

## Summary

This QA plan covers 400+ test cases across all Settings module sections, ensuring comprehensive testing of functionality, performance, security, and accessibility. The plan is structured to be executed systematically, with clear pass/fail criteria and detailed reporting requirements.
