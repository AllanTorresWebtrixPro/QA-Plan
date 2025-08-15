# Fix Database Connection Issue

## Problem

Your application is connecting to a different database than the one where the `basecamp_oauth_tokens` table exists.

## Solution

Update your environment variables to point to the correct database.

### Step 1: Get the correct Supabase credentials

1. Go to the Supabase dashboard where the `basecamp_oauth_tokens` table exists
2. Navigate to Settings > API
3. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 2: Update your .env file

Replace the current values in your `.env` file:

```env
# Current (incorrect) values
NEXT_PUBLIC_SUPABASE_URL=https://wrong-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_wrong_key...

# Replace with correct values
NEXT_PUBLIC_SUPABASE_URL=https://correct-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_correct_key...
```

### Step 3: Test the connection

After updating the environment variables, run:

```bash
node scripts/check-environment.js
```

You should see:

- ✅ Can access basecamp_oauth_tokens table
- Records found: 4 (or however many you have)

### Step 4: Test token retrieval

```bash
node scripts/test-token-retrieval.js
```

## Alternative: Create the table in current database

If you prefer to keep using the current database, you can:

1. Run the SQL migration in your current Supabase database:

   ```sql
   -- Copy the contents of scripts/fix-basecamp-table.sql
   -- and run it in your current database
   ```

2. Then copy the data from the other database to this one.

## Verification

After fixing the connection, the Basecamp OAuth integration should work properly and you should no longer see the "relation does not exist" error.
