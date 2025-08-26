-- Add miscellaneous issues table for issues not related to specific tests
-- This allows users to report general issues that don't fit into existing test categories

-- Create misc_issues table
CREATE TABLE IF NOT EXISTS qa_misc_issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  reported_by TEXT NOT NULL REFERENCES qa_users(id) ON DELETE CASCADE,
  assigned_to TEXT REFERENCES qa_users(id) ON DELETE SET NULL,
  basecamp_card_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_qa_misc_issues_category ON qa_misc_issues(category);
CREATE INDEX IF NOT EXISTS idx_qa_misc_issues_priority ON qa_misc_issues(priority);
CREATE INDEX IF NOT EXISTS idx_qa_misc_issues_status ON qa_misc_issues(status);
CREATE INDEX IF NOT EXISTS idx_qa_misc_issues_reported_by ON qa_misc_issues(reported_by);
CREATE INDEX IF NOT EXISTS idx_qa_misc_issues_assigned_to ON qa_misc_issues(assigned_to);
CREATE INDEX IF NOT EXISTS idx_qa_misc_issues_basecamp_card_ids ON qa_misc_issues USING GIN (basecamp_card_ids);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_qa_misc_issues_updated_at 
    BEFORE UPDATE ON qa_misc_issues 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easier querying of misc issues with user information
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
  reporter.email as reporter_email,
  reporter.avatar as reporter_avatar,
  assignee.name as assignee_name,
  assignee.email as assignee_email,
  assignee.avatar as assignee_avatar
FROM qa_misc_issues mi
LEFT JOIN qa_users reporter ON mi.reported_by = reporter.id
LEFT JOIN qa_users assignee ON mi.assigned_to = assignee.id;

-- Insert some sample misc issues for testing
INSERT INTO qa_misc_issues (id, title, description, category, priority, reported_by) VALUES
  (
    'misc-001',
    'General UI Responsiveness Issues',
    'The application seems to have some responsiveness issues on mobile devices. Elements are not scaling properly and some buttons are hard to tap.',
    'UI/UX',
    'Medium',
    'allan-torres'
  ),
  (
    'misc-002',
    'Performance Degradation',
    'The application is running slower than usual, especially when loading large datasets. This affects user experience significantly.',
    'Performance',
    'High',
    'joe-karie'
  ),
  (
    'misc-003',
    'Browser Compatibility Issue',
    'The application does not work properly in Safari browser. Some features are completely broken while others display incorrectly.',
    'Browser Compatibility',
    'High',
    'assaf-chami'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the setup
SELECT 'Misc Issues table created successfully!' as status;
SELECT 'Sample misc issues created: ' || count(*) as misc_issues_count FROM qa_misc_issues;
