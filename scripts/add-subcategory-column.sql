-- Add subcategory column to qa_tests table
ALTER TABLE qa_tests ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create an index for faster queries on subcategory
CREATE INDEX IF NOT EXISTS idx_qa_tests_subcategory ON qa_tests(subcategory);

-- Create a composite index for category + subcategory queries
CREATE INDEX IF NOT EXISTS idx_qa_tests_category_subcategory ON qa_tests(category, subcategory);

-- Update existing Settings tests to have proper subcategory values
-- This will be done by the Node.js script that re-inserts the data
