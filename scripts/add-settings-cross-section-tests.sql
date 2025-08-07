-- Settings Module - Cross-Section Testing
-- Test cases for cross-section functionality, navigation, and integration between Settings subsections

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Cross-Section Navigation Test Cases
('TC-CROSS-001: Verify Navigation Between Subsections', 'Settings', 'Cross-Section Testing', 'High', 
 '["1. Navigate to Settings tab", "2. Click on different subsection tabs", "3. Verify navigation works correctly"]', 
 'Navigation between Settings subsections should work smoothly without errors.', 
 '["Quick navigation", "Back navigation", "Direct URL access"]', NOW(), NOW()),

('TC-CROSS-002: Verify Secondary Tab Bar Persistence', 'Settings', 'Cross-Section Testing', 'Medium', 
 '["1. Navigate to Settings tab", "2. Select a subsection", "3. Navigate away and back", "4. Verify secondary tab bar state"]', 
 'Secondary tab bar should maintain its state when navigating away and back to Settings.', 
 '["Browser refresh", "Tab switching", "Deep linking"]', NOW(), NOW()),

('TC-CROSS-003: Verify Active Subsection Highlighting', 'Settings', 'Cross-Section Testing', 'Medium', 
 '["1. Navigate to Settings tab", "2. Click on different subsections", "3. Verify active subsection is highlighted"]', 
 'Active subsection should be visually highlighted in the secondary tab bar.', 
 '["Visual feedback", "Accessibility", "Color contrast"]', NOW(), NOW()),

('TC-CROSS-004: Verify Data Consistency Across Subsections', 'Settings', 'Cross-Section Testing', 'High', 
 '["1. Create data in one subsection", "2. Navigate to related subsection", "3. Verify data consistency"]', 
 'Data should remain consistent when viewed across different related subsections.', 
 '["Brand data", "User data", "Configuration data"]', NOW(), NOW()),

('TC-CROSS-005: Verify Cross-Section Dependencies', 'Settings', 'Cross-Section Testing', 'High', 
 '["1. Navigate to dependent subsection", "2. Check for required data from other subsections", "3. Verify dependencies are handled"]', 
 'Subsections should properly handle dependencies on data from other subsections.', 
 '["Brand dependencies", "User dependencies", "Template dependencies"]', NOW(), NOW()),

-- Cross-Section Data Integration Test Cases
('TC-CROSS-006: Verify Brand Data Integration', 'Settings', 'Cross-Section Testing', 'High', 
 '["1. Create a brand in Company section", "2. Navigate to other subsections", "3. Verify brand appears in dropdowns"]', 
 'Brands created in Company section should appear in all relevant subsection dropdowns.', 
 '["Dropdown population", "Data synchronization", "Real-time updates"]', NOW(), NOW()),

('TC-CROSS-007: Verify User Data Integration', 'Settings', 'Cross-Section Testing', 'High', 
 '["1. Create a user in Users section", "2. Navigate to other subsections", "3. Verify user appears in relevant lists"]', 
 'Users created in Users section should appear in all relevant subsection user lists.', 
 '["User lists", "Assignment options", "Permission checks"]', NOW(), NOW()),

('TC-CROSS-008: Verify Template Integration', 'Settings', 'Cross-Section Testing', 'Medium', 
 '["1. Create email template in Email Templates section", "2. Navigate to Email Notifications section", "3. Verify template appears in dropdown"]', 
 'Email templates should be available for selection in Email Notifications section.', 
 '["Template selection", "Brand filtering", "Template validation"]', NOW(), NOW()),

('TC-CROSS-009: Verify Lodge Data Integration', 'Settings', 'Cross-Section Testing', 'High', 
 '["1. Create a lodge in Lodges section", "2. Navigate to Supporting Trip Docs section", "3. Verify lodge appears in dropdown"]', 
 'Lodges created in Lodges section should appear in Supporting Trip Docs lodge dropdown.', 
 '["Lodge filtering", "Brand association", "Data consistency"]', NOW(), NOW()),

('TC-CROSS-010: Verify Payment Method Integration', 'Settings', 'Cross-Section Testing', 'Medium', 
 '["1. Create payment method in Payment Methods section", "2. Navigate to related sections", "3. Verify payment method is available"]', 
 'Payment methods should be available in sections that reference payment options.', 
 '["Payment selection", "Method validation", "Status checking"]', NOW(), NOW()),

-- Cross-Section State Management Test Cases
('TC-CROSS-011: Verify Form State Persistence', 'Settings', 'Cross-Section Testing', 'Medium', 
 '["1. Start filling a form in one subsection", "2. Navigate to another subsection", "3. Navigate back", "4. Verify form state"]', 
 'Form state should be preserved when navigating between subsections.', 
 '["Form data", "Validation state", "Error messages"]', NOW(), NOW()),

('TC-CROSS-012: Verify Filter State Persistence', 'Settings', 'Cross-Section Testing', 'Medium', 
 '["1. Apply filters in one subsection", "2. Navigate to another subsection", "3. Navigate back", "4. Verify filter state"]', 
 'Filter state should be preserved when navigating between subsections.', 
 '["Filter selections", "Search terms", "Sort preferences"]', NOW(), NOW()),

('TC-CROSS-013: Verify Error State Handling', 'Settings', 'Cross-Section Testing', 'High', 
 '["1. Create an error condition in one subsection", "2. Navigate to another subsection", "3. Verify error handling"]', 
 'Error states should be handled gracefully when navigating between subsections.', 
 '["Error messages", "Loading states", "Data recovery"]', NOW(), NOW()),

('TC-CROSS-014: Verify Loading State Management', 'Settings', 'Cross-Section Testing', 'Medium', 
 '["1. Trigger loading in one subsection", "2. Navigate to another subsection", "3. Verify loading state management"]', 
 'Loading states should be managed properly when navigating between subsections.', 
 '["Loading indicators", "Background processes", "State cleanup"]', NOW(), NOW());
