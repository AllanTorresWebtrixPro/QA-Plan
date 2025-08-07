-- Settings Module - Access Control Testing
-- Test cases for verifying that only Admin users can access Settings

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Access Control Test Cases
('TC-AC-001: Verify Admin Access to Settings', 'Settings', 'Access Control', 'High', 
 '["1. Login as Admin user (role_id = 1)", "2. Navigate to main dashboard", "3. Look for Settings link in navigation", "4. Click on Settings link", "5. Verify Settings page loads"]', 
 'Settings link should be visible and clickable. Settings page should load successfully with all sections accessible.', 
 '["Admin user with expired session", "Admin user with limited permissions"]', NOW(), NOW()),

('TC-AC-002: Verify Sales Rep Cannot Access Settings', 'Settings', 'Access Control', 'High', 
 '["1. Login as Sales Representative (role_id = 15)", "2. Navigate to main dashboard", "3. Look for Settings link in navigation", "4. Try to access Settings via direct URL"]', 
 'Settings link should not be visible in navigation. Direct URL access should redirect to unauthorized page or dashboard.', 
 '["Sales rep with elevated permissions", "Sales rep trying multiple URLs"]', NOW(), NOW()),

('TC-AC-003: Verify Lodge Manager Cannot Access Settings', 'Settings', 'Access Control', 'High', 
 '["1. Login as Lodge Manager (role_id = 2)", "2. Navigate to main dashboard", "3. Look for Settings link in navigation", "4. Try to access Settings via direct URL"]', 
 'Settings link should not be visible in navigation. Direct URL access should redirect to unauthorized page or dashboard.', 
 '["Lodge manager with admin privileges", "Lodge manager trying different Settings URLs"]', NOW(), NOW()),

('TC-AC-004: Verify Client Cannot Access Settings', 'Settings', 'Access Control', 'High', 
 '["1. Login as Client (role_id = 6)", "2. Navigate to main dashboard", "3. Look for Settings link in navigation", "4. Try to access Settings via direct URL"]', 
 'Settings link should not be visible in navigation. Direct URL access should redirect to unauthorized page or dashboard.', 
 '["Client with special permissions", "Client trying various Settings endpoints"]', NOW(), NOW()),

('TC-AC-005: Verify Unauthenticated User Redirect', 'Settings', 'Access Control', 'High', 
 '["1. Logout from application", "2. Try to access Settings via direct URL", "3. Verify redirect behavior"]', 
 'User should be redirected to login page. Settings should not be accessible without authentication.', 
 '["Session timeout scenarios", "Multiple redirect attempts"]', NOW(), NOW()),

('TC-NAV-001: Verify Settings Link Visibility for Admin', 'Settings', 'Access Control', 'Medium', 
 '["1. Login as Admin user", "2. Navigate to main dashboard", "3. Check top navigation menu", "4. Verify Settings link is present"]', 
 'Settings link should be visible in the top navigation menu for Admin users only.', 
 '["Navigation menu collapsed", "Mobile view navigation"]', NOW(), NOW()),

('TC-NAV-002: Verify Settings Link Highlighting', 'Settings', 'Access Control', 'Medium', 
 '["1. Login as Admin user", "2. Navigate to Settings page", "3. Check navigation menu", "4. Verify Settings link is highlighted"]', 
 'Settings link should be highlighted/active when user is on Settings pages.', 
 '["Multiple Settings subsections", "Navigation state persistence"]', NOW(), NOW()),

('TC-NAV-003: Verify Settings Sidebar Navigation', 'Settings', 'Access Control', 'Medium', 
 '["1. Login as Admin user", "2. Navigate to Settings page", "3. Check sidebar navigation", "4. Verify all sections are listed"]', 
 'Settings sidebar should display all available sections (Company, Users, Payment Methods, etc.).', 
 '["Sidebar collapsed state", "Responsive design"]', NOW(), NOW()),

('TC-NAV-004: Verify Direct URL Access for Admin', 'Settings', 'Access Control', 'Medium', 
 '["1. Login as Admin user", "2. Try accessing Settings via direct URL", "3. Verify page loads correctly"]', 
 'Direct URL access to Settings should work for Admin users.', 
 '["Bookmarked URLs", "Browser back/forward"]', NOW(), NOW()),

('TC-NAV-005: Verify Settings Default Redirect', 'Settings', 'Access Control', 'Medium', 
 '["1. Login as Admin user", "2. Navigate to /settings", "3. Verify redirect behavior"]', 
 'Accessing /settings should redirect to /settings/company by default.', 
 '["Direct navigation", "Bookmark access"]', NOW(), NOW());
