-- Create table for storing Basecamp OAuth tokens
CREATE TABLE IF NOT EXISTS basecamp_oauth_tokens (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    scope VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Add unique constraint to ensure one active token per user
    UNIQUE(user_id, is_active)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_basecamp_tokens_user_id ON basecamp_oauth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_basecamp_tokens_active ON basecamp_oauth_tokens(is_active);

-- Add comments for documentation
COMMENT ON TABLE basecamp_oauth_tokens IS 'Stores OAuth tokens for Basecamp API integration';
COMMENT ON COLUMN basecamp_oauth_tokens.user_id IS 'User identifier (can be email or user ID)';
COMMENT ON COLUMN basecamp_oauth_tokens.access_token IS 'OAuth access token for Basecamp API';
COMMENT ON COLUMN basecamp_oauth_tokens.refresh_token IS 'OAuth refresh token for renewing access tokens';
COMMENT ON COLUMN basecamp_oauth_tokens.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN basecamp_oauth_tokens.is_active IS 'Whether this token is currently active';

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_basecamp_tokens_updated_at 
    BEFORE UPDATE ON basecamp_oauth_tokens 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 