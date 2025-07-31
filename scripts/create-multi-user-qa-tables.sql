-- Create users table
CREATE TABLE IF NOT EXISTS qa_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tests table (master test definitions)
CREATE TABLE IF NOT EXISTS qa_tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  steps JSONB NOT NULL,
  expected TEXT NOT NULL,
  edge_cases JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_test_progress table (tracks individual user progress)
CREATE TABLE IF NOT EXISTS qa_user_test_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES qa_users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL REFERENCES qa_tests(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, test_id)
);

-- Insert default users
INSERT INTO qa_users (id, name, email, avatar) VALUES
  ('allan-torres', 'Allan Torres', 'allan@company.com', 'AT'),
  ('joe-karie', 'Joe Karie', 'joe@company.com', 'JK'),
  ('assaf-chami', 'Assaf Chami', 'assaf@company.com', 'AC')
ON CONFLICT (id) DO NOTHING;

-- Insert default test cases
INSERT INTO qa_tests (id, title, category, priority, steps, expected, edge_cases) VALUES
  (
    'auth-001',
    'Valid Login Test',
    'Authentication',
    'High',
    '["Navigate to login page", "Enter valid email/username", "Enter valid password", "Click Login button"]',
    'User is authenticated and redirected to dashboard',
    '["Test with leading/trailing spaces in credentials"]'
  ),
  (
    'auth-002',
    'Invalid Credentials Test',
    'Authentication',
    'High',
    '["Navigate to login page", "Enter invalid email", "Enter invalid password", "Click Login button"]',
    'Error message displayed, user remains on login page',
    '["Test with empty fields", "special characters", "SQL injection attempts"]'
  ),
  (
    'auth-003',
    'Password Reset Flow',
    'Authentication',
    'High',
    '["Click Forgot Password link", "Enter registered email", "Check email for reset link", "Click reset link", "Enter new password", "Confirm new password", "Submit"]',
    'Password reset email sent, password updated successfully',
    '["Test with non-registered email", "expired reset links", "weak passwords"]'
  ),
  (
    'inv-001',
    'Invoice Table Display',
    'Invoices',
    'High',
    '["Navigate to invoices page", "Verify all columns display correctly", "Check data formatting", "Verify pagination works"]',
    'Table shows all invoices with correct data and formatting',
    '["Test with 0 invoices", "1000+ invoices", "special characters in data"]'
  ),
  (
    'inv-002',
    'New Invoice Form',
    'Invoices',
    'High',
    '["Click New Invoice button", "Fill all required fields", "Add invoice items", "Set tax rates", "Save invoice"]',
    'Invoice created successfully, appears in list, all data saved correctly',
    '["Test with maximum field lengths", "special characters", "zero amounts"]'
  ),
  (
    'pro-001',
    'Prospect Creation',
    'Prospects',
    'Medium',
    '["Navigate to prospects page", "Click Add Prospect", "Fill all required fields", "Save prospect"]',
    'Prospect created, appears in list, all data saved',
    '["Test with duplicate emails", "missing required fields", "special characters"]'
  ),
  (
    'cli-001',
    'Client Profile Management',
    'Clients',
    'Medium',
    '["Create new client", "Add contact information", "Set preferences", "Save profile"]',
    'Client profile created with all information saved',
    '["Test with duplicate client data", "missing required information"]'
  ),
  (
    'pay-001',
    'Payment Method Management',
    'Payments',
    'High',
    '["Add payment method", "Edit payment method", "Remove payment method"]',
    'Payment methods managed correctly, validation works',
    '["Test with invalid card numbers", "expired cards"]'
  )
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_test_progress_user_id ON qa_user_test_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_test_progress_test_id ON qa_user_test_progress(test_id);
CREATE INDEX IF NOT EXISTS idx_user_test_progress_completed ON qa_user_test_progress(completed);
CREATE INDEX IF NOT EXISTS idx_qa_tests_category ON qa_tests(category);
CREATE INDEX IF NOT EXISTS idx_qa_tests_priority ON qa_tests(priority);

-- Drop existing triggers if they exist, then recreate them
DROP TRIGGER IF EXISTS update_qa_users_updated_at ON qa_users;
DROP TRIGGER IF EXISTS update_qa_tests_updated_at ON qa_tests;
DROP TRIGGER IF EXISTS update_qa_user_test_progress_updated_at ON qa_user_test_progress;

-- Create function to update updated_at timestamp (replace if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_qa_users_updated_at 
    BEFORE UPDATE ON qa_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qa_tests_updated_at 
    BEFORE UPDATE ON qa_tests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qa_user_test_progress_updated_at 
    BEFORE UPDATE ON qa_user_test_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
