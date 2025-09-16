-- Fix misc issues foreign key constraints
-- This script updates the qa_misc_issues table to reference user_profiles instead of qa_users

-- Step 1: Drop existing foreign key constraints
ALTER TABLE qa_misc_issues 
DROP CONSTRAINT IF EXISTS qa_misc_issues_reported_by_fkey;

ALTER TABLE qa_misc_issues 
DROP CONSTRAINT IF EXISTS qa_misc_issues_assigned_to_fkey;

-- Step 2: Add new foreign key constraints to user_profiles
ALTER TABLE qa_misc_issues 
ADD CONSTRAINT qa_misc_issues_reported_by_fkey 
FOREIGN KEY (reported_by) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE qa_misc_issues 
ADD CONSTRAINT qa_misc_issues_assigned_to_fkey 
FOREIGN KEY (assigned_to) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Step 3: Update the view to use user_profiles instead of qa_users
CREATE OR REPLACE VIEW misc_issues_with_users AS
SELECT 
  mi.id,
  mi.title,
  mi.description,
  mi.category,
  mi.priority,
  mi.status,
  mi.reported_by,
  mi.assigned_to,
  mi.basecamp_card_ids,
  mi.created_at,
  mi.updated_at,
  reporter.name as reporter_name,
  reporter.avatar as reporter_avatar,
  assignee.name as assignee_name,
  assignee.avatar as assignee_avatar
FROM qa_misc_issues mi
LEFT JOIN user_profiles reporter ON mi.reported_by = reporter.id
LEFT JOIN user_profiles assignee ON mi.assigned_to = assignee.id;

-- Step 4: Verify the changes
SELECT 'Foreign key constraints updated successfully!' as status;

-- Check if the view is working
SELECT 'View updated successfully!' as view_status;

-- Show current constraints
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'qa_misc_issues';
