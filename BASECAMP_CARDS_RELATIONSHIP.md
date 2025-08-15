# Basecamp Cards Database Relationship

## Overview

This document explains how Basecamp cards are now properly related to test cases in the database, replacing the previous unreliable text-based filtering approach.

## Database Schema Changes

### New Field Added

The `qa_user_test_progress` table now includes a new field:

```sql
basecamp_card_ids JSONB DEFAULT '[]'::jsonb
```

This field stores an array of Basecamp card IDs that are associated with each test progress record.

### Field Structure

- **Type**: `JSONB` (PostgreSQL JSON Binary)
- **Default**: Empty array `[]`
- **Format**: `["card_id_1", "card_id_2", "card_id_3", ...]`
- **Index**: GIN index for efficient querying

## How It Works

### 1. Card Creation
When a user writes a note for a test:
1. A Basecamp card is created via the Basecamp API
2. The card ID is returned from the Basecamp API
3. The card ID is added to the `basecamp_card_ids` array in the database
4. If the test progress record doesn't exist, it's created with the card ID
5. If the record exists, the card ID is appended to the existing array

### 2. Card Retrieval
When fetching cards for a test:
1. Query all `qa_user_test_progress` records for the specific test ID
2. Collect all `basecamp_card_ids` from all users' progress records
3. Remove duplicates (same card might be referenced by multiple users)
4. Fetch the actual card data from Basecamp API using the stored IDs
5. Return the filtered cards with their details

## Benefits

### 1. **Reliable Relationship**
- No more unreliable text-based filtering
- Direct relationship between tests and cards via stored IDs
- Handles multiple cards per test correctly

### 2. **Performance**
- GIN index on JSONB field for fast queries
- No need to fetch all cards and filter them
- Only fetch cards that are actually related

### 3. **Scalability**
- Works with any number of cards per test
- Efficient even with large numbers of cards
- Supports multiple users creating cards for the same test

### 4. **Data Integrity**
- No false positives from text matching
- No missed cards due to text variations
- Clear audit trail of which cards belong to which tests

## Migration

To add this field to existing databases, run:

```bash
node scripts/run-basecamp-cards-migration.js
```

Or manually execute the SQL in your Supabase dashboard:

```sql
-- Add the column
ALTER TABLE qa_user_test_progress 
ADD COLUMN IF NOT EXISTS basecamp_card_ids JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN qa_user_test_progress.basecamp_card_ids IS 
'Array of Basecamp card IDs associated with this test progress record. Format: ["card_id_1", "card_id_2", ...]';

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_test_progress_basecamp_card_ids 
ON qa_user_test_progress USING GIN (basecamp_card_ids);

-- Update existing records
UPDATE qa_user_test_progress 
SET basecamp_card_ids = '[]'::jsonb 
WHERE basecamp_card_ids IS NULL;
```

## API Changes

### Updated Endpoints

1. **POST /api/qa/add-note**
   - Now stores Basecamp card IDs in the database
   - Returns card creation status

2. **GET /api/qa/test-cards/[testId]**
   - Now uses stored card IDs instead of text filtering
   - More reliable and performant

### New Behavior

- Cards are automatically associated with tests when notes are created
- Multiple cards can be associated with the same test
- Cards are properly deduplicated when multiple users reference the same card
- The relationship persists even if card titles/content change

## Example Data

```json
{
  "id": "user123-test456",
  "user_id": "user123",
  "test_id": "test456",
  "completed": false,
  "notes": "Found an issue with the login flow",
  "basecamp_card_ids": ["card_789", "card_101"],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

In this example, the test progress record is associated with two Basecamp cards: `card_789` and `card_101`. 