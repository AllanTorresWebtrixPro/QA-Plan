-- Settings Module - Security Testing
-- Test cases for security, authentication, authorization, and data protection in Settings functionality

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Security Testing Test Cases
('TC-SEC-001: Verify Authentication Required', 'Settings', 'Security Testing', 'High', 
 '["1. Log out of the application", "2. Try to access Settings directly via URL", "3. Verify authentication is required"]', 
 'Settings should require authentication and redirect to login page if not authenticated.', 
 '["Direct URL access", "Session expiration", "Token validation"]', NOW(), NOW()),

('TC-SEC-002: Verify Authorization Checks', 'Settings', 'Security Testing', 'High', 
 '["1. Login with user having limited permissions", "2. Navigate to Settings", "3. Verify only authorized sections are accessible"]', 
 'Users should only be able to access Settings sections they have permission for.', 
 '["Role-based access", "Permission checks", "Unauthorized access"]', NOW(), NOW()),

('TC-SEC-003: Verify Input Validation', 'Settings', 'Security Testing', 'High', 
 '["1. Navigate to any Settings subsection", "2. Enter malicious input in forms", "3. Verify input is properly validated"]', 
 'All form inputs should be validated to prevent injection attacks.', 
 '["SQL injection", "XSS attacks", "Script injection"]', NOW(), NOW()),

('TC-SEC-004: Verify CSRF Protection', 'Settings', 'Security Testing', 'High', 
 '["1. Open Settings in browser", "2. Attempt to submit forms from external source", "3. Verify CSRF protection is in place"]', 
 'Forms should be protected against Cross-Site Request Forgery attacks.', 
 '["CSRF tokens", "Request validation", "Token expiration"]', NOW(), NOW()),

('TC-SEC-005: Verify XSS Prevention', 'Settings', 'Security Testing', 'High', 
 '["1. Navigate to Settings subsections", "2. Enter script tags in text fields", "3. Verify scripts are not executed"]', 
 'User input should be properly sanitized to prevent XSS attacks.', 
 '["Script execution", "HTML encoding", "Content filtering"]', NOW(), NOW()),

('TC-SEC-006: Verify Data Encryption', 'Settings', 'Security Testing', 'Medium', 
 '["1. Monitor network traffic during Settings operations", "2. Verify sensitive data is encrypted", "3. Check for HTTPS usage"]', 
 'All sensitive data should be encrypted in transit and at rest.', 
 '["HTTPS enforcement", "Data encryption", "Secure storage"]', NOW(), NOW()),

('TC-SEC-007: Verify Session Security', 'Settings', 'Security Testing', 'High', 
 '["1. Login to Settings", "2. Leave session idle", "3. Verify session timeout and security"]', 
 'Sessions should timeout appropriately and be secure against hijacking.', 
 '["Session timeout", "Session invalidation", "Secure cookies"]', NOW(), NOW()),

('TC-SEC-008: Verify API Security', 'Settings', 'Security Testing', 'High', 
 '["1. Monitor API calls from Settings", "2. Verify proper authentication headers", "3. Check for secure API endpoints"]', 
 'All API calls should use proper authentication and authorization.', 
 '["API tokens", "Request headers", "Endpoint security"]', NOW(), NOW()),

('TC-SEC-009: Verify File Upload Security', 'Settings', 'Security Testing', 'High', 
 '["1. Navigate to Supporting Trip Docs section", "2. Try to upload malicious files", "3. Verify file type and content validation"]', 
 'File uploads should be validated for type, size, and content security.', 
 '["File type validation", "Content scanning", "Size limits"]', NOW(), NOW()),

('TC-SEC-010: Verify Audit Logging', 'Settings', 'Security Testing', 'Medium', 
 '["1. Perform various Settings operations", "2. Check for audit logs", "3. Verify sensitive operations are logged"]', 
 'All sensitive Settings operations should be logged for audit purposes.', 
 '["User actions", "Data changes", "Access logs"]', NOW(), NOW()),

('TC-SEC-011: Verify Data Access Controls', 'Settings', 'Security Testing', 'High', 
 '["1. Login with different user roles", "2. Access Settings data", "3. Verify data access is properly restricted"]', 
 'Users should only be able to access data they are authorized to view or modify.', 
 '["Data isolation", "Permission checks", "Role-based access"]', NOW(), NOW());
