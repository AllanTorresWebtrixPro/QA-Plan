-- Fix Basecamp OAuth Tokens Table
-- Add missing columns that are required by the application

-- Add is_active column
ALTER TABLE basecamp_oauth_tokens 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add token_type column
ALTER TABLE basecamp_oauth_tokens 
ADD COLUMN IF NOT EXISTS token_type VARCHAR(50) DEFAULT 'Bearer';

-- Add scope column
ALTER TABLE basecamp_oauth_tokens 
ADD COLUMN IF NOT EXISTS scope VARCHAR(255);

-- Add created_at column
ALTER TABLE basecamp_oauth_tokens 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add updated_at column
ALTER TABLE basecamp_oauth_tokens 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have is_active = true
UPDATE basecamp_oauth_tokens 
SET is_active = TRUE 
WHERE is_active IS NULL;

-- Update existing records to have token_type = 'Bearer'
UPDATE basecamp_oauth_tokens 
SET token_type = 'Bearer' 
WHERE token_type IS NULL;

-- Update existing records to have created_at and updated_at timestamps
UPDATE basecamp_oauth_tokens 
SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'basecamp_oauth_tokens' 
AND table_schema = 'public'
ORDER BY ordinal_position; 