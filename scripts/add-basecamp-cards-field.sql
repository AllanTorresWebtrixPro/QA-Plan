-- Add basecamp_card_ids field to qa_user_test_progress table
-- This field will store an array of Basecamp card IDs associated with each test progress record

-- Add the new column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'qa_user_test_progress' 
        AND column_name = 'basecamp_card_ids'
    ) THEN
        ALTER TABLE qa_user_test_progress 
        ADD COLUMN basecamp_card_ids JSONB DEFAULT '[]'::jsonb;
        
        -- Add a comment to document the field
        COMMENT ON COLUMN qa_user_test_progress.basecamp_card_ids IS 
        'Array of Basecamp card IDs associated with this test progress record. Format: ["card_id_1", "card_id_2", ...]';
    END IF;
END $$;

-- Create an index for better performance when querying by card IDs
CREATE INDEX IF NOT EXISTS idx_user_test_progress_basecamp_card_ids 
ON qa_user_test_progress USING GIN (basecamp_card_ids);

-- Update existing records to have an empty array if they don't have the field
UPDATE qa_user_test_progress 
SET basecamp_card_ids = '[]'::jsonb 
WHERE basecamp_card_ids IS NULL; 