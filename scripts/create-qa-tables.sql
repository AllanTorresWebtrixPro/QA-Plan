-- Create the qa_tests table
CREATE TABLE IF NOT EXISTS qa_tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  steps JSONB NOT NULL,
  expected TEXT NOT NULL,
  edge_cases JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_qa_tests_category ON qa_tests(category);
CREATE INDEX IF NOT EXISTS idx_qa_tests_priority ON qa_tests(priority);
CREATE INDEX IF NOT EXISTS idx_qa_tests_completed ON qa_tests(completed);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_qa_tests_updated_at 
    BEFORE UPDATE ON qa_tests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
