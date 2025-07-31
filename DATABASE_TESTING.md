# Database Connection Testing

This document explains how to test and verify the database connection for the QA Plan application.

## Overview

The application uses Supabase as the database backend. The database connection testing includes:

- Environment variable verification
- Database connectivity tests
- Table existence and data validation
- Sample data retrieval tests

## Testing Methods

### 1. Web Interface Test

Visit the database test page in your browser:

```
http://localhost:3000/database-test
```

This provides a visual interface showing:

- Connection status
- Environment variable status
- Table existence and record counts
- Detailed error messages
- Test summary

### 2. API Endpoint Test

Test the database connection via API:

```bash
curl http://localhost:3000/api/database-test
```

This returns a JSON response with detailed test results.

### 3. Command Line Test

Run the database test script from the command line:

```bash
npm run test:db
# or
yarn test:db
# or
pnpm test:db
```

This provides a detailed console output with test results.

## Environment Setup

Before running tests, ensure you have the following environment variables configured in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Expected Database Schema

The application expects the following tables to exist:

### qa_users

- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `avatar` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### qa_tests

- `id` (TEXT, PRIMARY KEY)
- `title` (TEXT, NOT NULL)
- `category` (TEXT, NOT NULL)
- `priority` (TEXT, NOT NULL, CHECK: 'High', 'Medium', 'Low')
- `steps` (JSONB, NOT NULL)
- `expected` (TEXT, NOT NULL)
- `edge_cases` (JSONB, NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### qa_user_test_progress

- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, NOT NULL, FOREIGN KEY)
- `test_id` (TEXT, NOT NULL, FOREIGN KEY)
- `completed` (BOOLEAN, DEFAULT FALSE)
- `completed_at` (TIMESTAMP)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Test Results Interpretation

### Success Indicators

- ✅ Database connection successful
- ✅ All environment variables configured
- ✅ All required tables exist
- ✅ Sample data can be retrieved
- ✅ Response time < 1000ms

### Common Issues

1. **Environment Variables Missing**

   - Error: "NEXT_PUBLIC_SUPABASE_URL is not configured"
   - Solution: Add environment variables to `.env.local`

2. **Invalid Credentials**

   - Error: "Connection failed: Invalid API key"
   - Solution: Verify Supabase URL and API key

3. **Tables Don't Exist**

   - Error: "Table qa_users does not exist"
   - Solution: Run database initialization scripts

4. **Network Issues**
   - Error: "Connection timeout"
   - Solution: Check internet connection and Supabase service status

## Database Initialization

If tables don't exist, run the initialization scripts:

```sql
-- Run the initialization script
\i scripts/initialize-qa-database.sql
```

## Troubleshooting

### Check Supabase Status

Visit [Supabase Status Page](https://status.supabase.com/) to verify service availability.

### Verify Project Settings

1. Go to your Supabase project dashboard
2. Check API settings for correct URL and keys
3. Verify RLS (Row Level Security) policies
4. Check database logs for errors

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run database test
npm run test:db

# Build for production
npm run build
```

## Support

If you encounter issues:

1. Check the error messages in the test output
2. Verify environment variables are correctly set
3. Ensure Supabase project is properly configured
4. Check network connectivity
5. Review Supabase documentation for troubleshooting
