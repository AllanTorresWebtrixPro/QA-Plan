-- Settings Module - Accessibility Testing
-- Test cases for accessibility, screen readers, keyboard navigation, and WCAG compliance in Settings functionality

INSERT INTO test_cases (title, category, subcategory, priority, steps, expected, edge_cases, created_at, updated_at) VALUES
-- Accessibility Testing Test Cases
('TC-A11Y-001: Verify Keyboard Navigation', 'Settings', 'Accessibility Testing', 'High', 
 '["1. Navigate to Settings using only keyboard", "2. Test tab navigation through all elements", "3. Verify keyboard accessibility"]', 
 'All Settings functionality should be accessible via keyboard navigation.', 
 '["Tab order", "Focus indicators", "Keyboard shortcuts"]', NOW(), NOW()),

('TC-A11Y-002: Verify Screen Reader Compatibility', 'Settings', 'Accessibility Testing', 'High', 
 '["1. Use screen reader to navigate Settings", "2. Verify all elements have proper labels", "3. Check for meaningful descriptions"]', 
 'Settings should be fully compatible with screen readers and assistive technologies.', 
 '["ARIA labels", "Alt text", "Descriptive text"]', NOW(), NOW()),

('TC-A11Y-003: Verify Color Contrast Compliance', 'Settings', 'Accessibility Testing', 'Medium', 
 '["1. Check color contrast ratios in Settings", "2. Verify text meets WCAG contrast requirements", "3. Test with color blindness simulators"]', 
 'All text and UI elements should meet WCAG color contrast requirements.', 
 '["Text contrast", "Background contrast", "Color blindness"]', NOW(), NOW()),

('TC-A11Y-004: Verify Focus Management', 'Settings', 'Accessibility Testing', 'High', 
 '["1. Navigate through Settings with keyboard", "2. Verify focus is properly managed", "3. Check for focus traps and indicators"]', 
 'Focus should be properly managed and visible throughout Settings navigation.', 
 '["Focus indicators", "Focus order", "Focus traps"]', NOW(), NOW()),

('TC-A11Y-005: Verify Form Accessibility', 'Settings', 'Accessibility Testing', 'High', 
 '["1. Test all forms in Settings with screen reader", "2. Verify form labels and error messages", "3. Check for proper form structure"]', 
 'All forms should be accessible with proper labels, error messages, and structure.', 
 '["Form labels", "Error messages", "Field grouping"]', NOW(), NOW()),

('TC-A11Y-006: Verify Responsive Design Accessibility', 'Settings', 'Accessibility Testing', 'Medium', 
 '["1. Test Settings on different screen sizes", "2. Verify accessibility on mobile devices", "3. Check touch target sizes"]', 
 'Settings should remain accessible across different screen sizes and devices.', 
 '["Touch targets", "Responsive layout", "Mobile accessibility"]', NOW(), NOW());
