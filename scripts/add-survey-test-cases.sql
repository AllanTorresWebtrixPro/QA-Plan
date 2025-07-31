-- Add comprehensive survey test cases to the QA database

INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  -- Survey Dashboard & Overview
  (
    'srv-001',
    'Survey Dashboard Display',
    'Surveys',
    'High',
    '["Navigate to surveys page", "Verify KPI cards display correctly", "Check completion rates", "Verify total counts"]',
    'Dashboard shows accurate survey statistics and metrics',
    '["Test with no surveys", "many surveys", "zero completion rates"]'
  ),
  (
    'srv-002',
    'Survey KPIs and Metrics',
    'Surveys',
    'High',
    '["Check Filled Out count", "Check Not Filled Out count", "Verify completion rate calculation", "Check total surveys count"]',
    'All metrics calculate correctly and display accurate numbers',
    '["Test with 0 surveys", "100% completion", "decimal percentages"]'
  ),
  (
    'srv-003',
    'Survey Filtering and Search',
    'Surveys',
    'Medium',
    '["Use brand filter dropdown", "Use lodge filter dropdown", "Enter search terms", "Clear filters"]',
    'Filters work correctly, search returns relevant results',
    '["Test with empty results", "special characters", "very long search terms"]'
  ),

  -- Survey Management (Settings)
  (
    'srv-004',
    'Survey Creation',
    'Surveys',
    'High',
    '["Navigate to settings/surveys", "Click Add Survey", "Fill survey details (title, brand, lodge, category)", "Save survey"]',
    'Survey created successfully, appears in surveys list',
    '["Test with duplicate titles", "missing required fields", "special characters"]'
  ),
  (
    'srv-005',
    'Survey Editing',
    'Surveys',
    'High',
    '["Open existing survey", "Click edit button", "Modify survey details", "Save changes"]',
    'Survey updated successfully, changes reflected in list',
    '["Test with concurrent edits", "validation errors", "network interruptions"]'
  ),
  (
    'srv-006',
    'Survey Deletion',
    'Surveys',
    'High',
    '["Select survey to delete", "Click delete button", "Confirm deletion", "Verify removal"]',
    'Survey deleted successfully, removed from list',
    '["Test with surveys having submissions", "surveys with sections/questions"]'
  ),
  (
    'srv-007',
    'Survey Viewing',
    'Surveys',
    'Medium',
    '["Click view button on survey", "Verify survey details display", "Check creation date formatting"]',
    'Survey details displayed correctly with proper date formatting',
    '["Test with surveys having no sections", "surveys with many sections"]'
  ),
  (
    'srv-008',
    'Survey Statistics',
    'Surveys',
    'Medium',
    '["Click stats button on survey", "Verify statistics dialog opens", "Check monthly data display", "Verify date formatting"]',
    'Statistics display correctly with proper date formatting',
    '["Test with surveys having no submissions", "surveys with many submissions"]'
  ),

  -- Survey Section Management
  (
    'srv-009',
    'Section Creation',
    'Surveys',
    'High',
    '["Navigate to survey sections", "Click Add Section", "Fill section details (title, description, survey, position)", "Save section"]',
    'Section created successfully, appears in sections list',
    '["Test with duplicate titles", "missing required fields", "invalid positions"]'
  ),
  (
    'srv-010',
    'Section Editing',
    'Surveys',
    'Medium',
    '["Open existing section", "Click edit button", "Modify section details", "Save changes"]',
    'Section updated successfully, changes reflected in list',
    '["Test with sections having questions", "concurrent edits"]'
  ),
  (
    'srv-011',
    'Section Deletion',
    'Surveys',
    'Medium',
    '["Select section to delete", "Click delete button", "Confirm deletion", "Verify removal"]',
    'Section deleted successfully, removed from list',
    '["Test with sections containing questions", "sections with answers"]'
  ),
  (
    'srv-012',
    'Section Reordering',
    'Surveys',
    'Medium',
    '["Use drag-and-drop or reorder controls", "Change section positions", "Save reorder", "Verify new order"]',
    'Sections reordered correctly, new order saved',
    '["Test with many sections", "invalid position values"]'
  ),

  -- Survey Question Management
  (
    'srv-013',
    'Question Creation',
    'Surveys',
    'High',
    '["Navigate to survey questions", "Click Add Question", "Fill question details (text, type, options, validation)", "Save question"]',
    'Question created successfully, appears in questions list',
    '["Test with all question types", "required fields", "complex options"]'
  ),
  (
    'srv-014',
    'Question Types Testing',
    'Surveys',
    'High',
    '["Create questions of each type (text, textarea, number, email, phone, select, radio, checkbox, rating, matrix)", "Verify form validation", "Test options management"]',
    'All question types work correctly with proper validation',
    '["Test with empty options", "maximum values", "special characters"]'
  ),
  (
    'srv-015',
    'Question Editing',
    'Surveys',
    'Medium',
    '["Open existing question", "Click edit button", "Modify question details", "Save changes"]',
    'Question updated successfully, changes reflected in list',
    '["Test with questions having answers", "type changes affecting existing data"]'
  ),
  (
    'srv-016',
    'Question Deletion',
    'Surveys',
    'Medium',
    '["Select question to delete", "Click delete button", "Confirm deletion", "Verify removal"]',
    'Question deleted successfully, removed from list',
    '["Test with questions having answers", "required questions"]'
  ),
  (
    'srv-017',
    'Question Options Management',
    'Surveys',
    'Medium',
    '["Add options to select/radio/checkbox questions", "Edit option labels and values", "Remove options", "Reorder options"]',
    'Options managed correctly, validation works',
    '["Test with empty options", "duplicate values", "many options"]'
  ),
  (
    'srv-018',
    'Matrix Question Items',
    'Surveys',
    'Medium',
    '["Create matrix question", "Add matrix items", "Edit item text", "Remove items", "Reorder items"]',
    'Matrix items managed correctly, validation works',
    '["Test with empty items", "many items", "special characters"]'
  ),

  -- Survey Filling (User Experience)
  (
    'srv-019',
    'Survey Access and Navigation',
    'Surveys',
    'High',
    '["Navigate to surveys page", "Find survey to fill", "Click Fill Survey button", "Verify survey opens"]',
    'Survey opens correctly with proper navigation',
    '["Test with surveys having no sections", "surveys with many sections"]'
  ),
  (
    'srv-020',
    'Multi-Section Survey Navigation',
    'Surveys',
    'High',
    '["Open multi-section survey", "Navigate between sections", "Use progress indicators", "Verify section validation"]',
    'Navigation works smoothly, progress tracked correctly',
    '["Test with required field validation", "section dependencies"]'
  ),
  (
    'srv-021',
    'Question Answering',
    'Surveys',
    'High',
    '["Answer each question type correctly", "Test required field validation", "Test input validation", "Verify answer saving"]',
    'All question types work correctly, validation functions properly',
    '["Test with invalid inputs", "maximum lengths", "special characters"]'
  ),
  (
    'srv-022',
    'Survey Progress Saving',
    'Surveys',
    'High',
    '["Fill partial survey", "Navigate between sections", "Close and reopen survey", "Verify answers preserved"]',
    'Progress saved automatically, answers restored correctly',
    '["Test with network interruptions", "browser refresh", "multiple tabs"]'
  ),
  (
    'srv-023',
    'Survey Submission',
    'Surveys',
    'High',
    '["Complete all required fields", "Click submit button", "Confirm submission", "Verify success message"]',
    'Survey submitted successfully, confirmation shown',
    '["Test with incomplete required fields", "network errors", "duplicate submissions"]'
  ),
  (
    'srv-024',
    'Survey Draft Management',
    'Surveys',
    'Medium',
    '["Start survey but do not complete", "Close survey", "Reopen survey", "Verify draft status"]',
    'Draft saved correctly, can resume later',
    '["Test with long periods between sessions"]'
  ),

  -- Survey Submission Viewing
  (
    'srv-025',
    'Submission List Display',
    'Surveys',
    'Medium',
    '["Navigate to surveys with submissions", "Verify submission status badges", "Check submission dates", "Verify date formatting"]',
    'Submissions display correctly with proper status and date formatting',
    '["Test with no submissions", "many submissions", "different statuses"]'
  ),
  (
    'srv-026',
    'Submission Details Viewing',
    'Surveys',
    'Medium',
    '["Click View on submitted survey", "Verify all answers display", "Check section organization", "Verify answer formatting"]',
    'All submission details displayed correctly with proper formatting',
    '["Test with long answers", "special characters", "matrix questions"]'
  ),
  (
    'srv-027',
    'Submission Data Export',
    'Surveys',
    'Medium',
    '["View submission details", "Look for export options", "Test export functionality", "Verify exported data"]',
    'Export works correctly with complete data',
    '["Test with large datasets", "special characters", "different formats"]'
  ),

  -- Survey Analytics and Reporting
  (
    'srv-028',
    'Survey Statistics Display',
    'Surveys',
    'Medium',
    '["Open survey statistics", "Verify monthly data", "Check completion rates", "Verify calculations"]',
    'Statistics display correctly with accurate calculations',
    '["Test with no data", "incomplete data", "edge case calculations"]'
  ),
  (
    'srv-029',
    'Survey Response Analysis',
    'Surveys',
    'Medium',
    '["View survey responses", "Analyze answer patterns", "Check response rates", "Verify data accuracy"]',
    'Response analysis provides accurate insights',
    '["Test with partial responses", "invalid data", "missing responses"]'
  ),

  -- Survey Integration and Workflow
  (
    'srv-030',
    'Survey Assignment to Pretrips',
    'Surveys',
    'High',
    '["Create survey for specific brand/lodge", "Verify survey appears for matching pretrips", "Test survey assignment logic"]',
    'Surveys correctly assigned to appropriate pretrips',
    '["Test with multiple brands/lodges", "no matching pretrips"]'
  ),
  (
    'srv-031',
    'Survey Completion Workflow',
    'Surveys',
    'High',
    '["Complete survey submission", "Verify status updates", "Check notification triggers", "Verify data flow"]',
    'Survey completion triggers appropriate workflow updates',
    '["Test with partial completions", "failed submissions", "duplicate submissions"]'
  ),
  (
    'srv-032',
    'Survey Data Integration',
    'Surveys',
    'High',
    '["Submit survey", "Verify data appears in reports", "Check data consistency", "Test data relationships"]',
    'Survey data integrates correctly with other system data',
    '["Test with data conflicts", "missing relationships", "orphaned data"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the survey test cases were added
SELECT 'Survey test cases added successfully!' as status;
SELECT 'Survey tests added: ' || count(*) as survey_test_count FROM qa_tests WHERE category = 'Surveys';
SELECT 'Total tests now: ' || count(*) as total_test_count FROM qa_tests;
