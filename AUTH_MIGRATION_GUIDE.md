# Authentication Migration Guide

This guide explains how to migrate from the custom `qa_users` table to Supabase's built-in authentication system.

## Overview

The migration involves:
1. Creating a `user_profiles` table for additional user data
2. Migrating existing users to `auth.users`
3. Updating foreign key constraints
4. Enabling Row Level Security (RLS)
5. Updating all code references

## Prerequisites

1. **Supabase Service Role Key**: You'll need the service role key to create users programmatically
2. **Backup**: Make sure you have a backup of your current data
3. **Environment Variables**: Ensure your `.env.local` has the required Supabase keys

## Migration Steps

### Step 1: Add Service Role Key

Add your Supabase service role key to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

You can find this in your Supabase dashboard under Settings > API.

### Step 2: Run Database Migration

Execute the SQL migration script:

```bash
# Connect to your Supabase database and run:
# scripts/migrate-to-supabase-auth.sql
```

This script will:
- Create the `user_profiles` table
- Update foreign key constraints
- Enable RLS policies
- Create triggers for automatic profile creation

### Step 3: Migrate Existing Users

Run the user migration script:

```bash
npm run migrate:users
```

This will:
- Fetch all users from `qa_users`
- Create corresponding users in `auth.users`
- Update `qa_user_test_progress` to reference new user IDs

### Step 4: Test the Migration

1. **Test Authentication**:
   - Visit `/auth/login`
   - Try signing up with a new account
   - Try signing in with migrated accounts (use temporary password)

2. **Test Database Connection**:
   - Visit `/database-test`
   - Verify all tables are working correctly

3. **Test QA Functionality**:
   - Verify users can view and update test progress
   - Check that RLS policies are working correctly

### Step 5: Update User Passwords

After migration, users will need to reset their passwords:

1. Users can use the "Forgot Password" feature on the login page
2. Or you can manually set passwords through the Supabase dashboard

### Step 6: Clean Up (Optional)

Once everything is working correctly, you can:

1. Drop the `qa_users` table
2. Remove old migration scripts
3. Update documentation

## RLS Policies

The migration includes these Row Level Security policies:

### qa_user_test_progress
- **SELECT**: All authenticated users can view all progress (for collaboration)
- **INSERT/UPDATE/DELETE**: Users can only modify their own progress

### qa_tests
- **SELECT**: All authenticated users can view all tests

### user_profiles
- **SELECT**: All authenticated users can view all profiles
- **INSERT/UPDATE**: Users can only modify their own profile

## Code Changes Made

### New Files Created
- `components/providers/auth-provider.tsx` - Authentication context
- `components/auth/auth-guard.tsx` - Route protection
- `app/auth/login/page.tsx` - Login/signup page
- `scripts/migrate-to-supabase-auth.sql` - Database migration
- `scripts/migrate-users-to-auth.js` - User migration script

### Files Updated
- `app/layout.tsx` - Added AuthProvider
- `app/page.tsx` - Added AuthGuard
- `services/qa-service.ts` - Updated getUserById function
- All API routes - Updated to use `user_profiles` instead of `qa_users`
- Database test components - Updated table references

## Troubleshooting

### Common Issues

1. **Service Role Key Missing**
   - Error: "Service role key not found"
   - Solution: Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`

2. **Foreign Key Constraint Errors**
   - Error: "Foreign key constraint violation"
   - Solution: Ensure user migration completed successfully

3. **RLS Policy Issues**
   - Error: "Row Level Security policy violation"
   - Solution: Check that RLS policies are correctly applied

4. **User Profile Not Created**
   - Issue: User exists in `auth.users` but not in `user_profiles`
   - Solution: Check the trigger function `handle_new_user()`

### Rollback Plan

If you need to rollback:

1. Restore from backup
2. Drop the `user_profiles` table
3. Revert foreign key constraints
4. Remove RLS policies
5. Revert code changes

## Benefits After Migration

1. **Better Security**: Leverage Supabase's battle-tested auth system
2. **Reduced Maintenance**: No custom user management code
3. **Built-in Features**: Password reset, OAuth, session management
4. **Row Level Security**: Data protection at the database level
5. **Scalability**: Easy to add more auth providers in the future

## Support

If you encounter issues during migration:

1. Check the Supabase logs in your dashboard
2. Verify all environment variables are set correctly
3. Test each step individually
4. Review the RLS policies in your Supabase dashboard 