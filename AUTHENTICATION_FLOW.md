# Authentication Flow Documentation

## Overview

The QA Plan application implements a comprehensive authentication system using Supabase Auth with automatic redirection for unauthenticated users.

## Authentication Components

### 1. AuthProvider (`components/providers/auth-provider.tsx`)
- Manages authentication state using Supabase Auth
- Provides user session, profile, and authentication methods
- Handles automatic session restoration on page load
- Manages user profile data from the `user_profiles` table

### 2. AuthGuard (`components/auth/auth-guard.tsx`)
- Protects routes from unauthorized access
- Automatically redirects unauthenticated users to `/auth/login`
- Shows loading states during authentication checks
- Prevents content flash before redirect

### 3. Login Page (`app/auth/login/page.tsx`)
- Handles user sign-in, sign-up, and password reset
- No AuthGuard protection (to avoid redirect loops)
- Redirects authenticated users to dashboard after login

## Protected Routes

All the following routes are now protected with AuthGuard:

- `/` - Main dashboard
- `/reports` - Reports and analytics
- `/settings` - Application settings
- `/users` - User management and progress
- `/test-cases` - Test case management
- `/basecamp-config` - Basecamp integration configuration
- `/database-test` - Database connection testing
- `/profile/*` - User profile pages

## Authentication Flow

### 1. User Accessing Protected Route
```
User visits protected route → AuthGuard checks authentication → 
If not authenticated → Redirect to /auth/login
If authenticated → Render protected content
```

### 2. User Login
```
User enters credentials → Supabase Auth validates → 
If successful → Redirect to dashboard
If failed → Show error message
```

### 3. User Logout
```
User clicks sign out → Clear local state → 
Clear Supabase session → Redirect to /auth/login
```

### 4. Session Restoration
```
Page load → AuthProvider checks for existing session → 
If valid session exists → Restore user state
If no session → User remains unauthenticated
```

## Implementation Details

### AuthGuard Behavior
- **Loading State**: Shows spinner while checking authentication
- **Unauthenticated**: Shows "Redirecting to login..." message
- **Authenticated**: Renders the protected content
- **Automatic Redirect**: Uses Next.js router to redirect to login page

### Navigation Integration
- Navigation component shows user menu only when authenticated
- Sign-out functionality properly clears all state
- Role-based navigation filtering for admin-only features

### Error Handling
- Graceful handling of authentication errors
- Clear error messages for users
- Fallback redirects if authentication fails

## Security Features

1. **Route Protection**: All sensitive routes are protected
2. **Session Management**: Proper session handling with Supabase
3. **State Clearing**: Complete state cleanup on logout
4. **Role-Based Access**: Admin-only features properly restricted
5. **No Content Flash**: Prevents unauthorized content from being displayed

## Testing Authentication

To test the authentication flow:

1. **Without Login**: Try accessing any protected route - should redirect to login
2. **With Login**: After logging in, should access protected routes normally
3. **After Logout**: Should be redirected to login page
4. **Session Persistence**: Refresh page while logged in - should maintain session

## Environment Variables Required

Ensure these environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Requirements

The authentication system requires:
- Supabase Auth enabled
- `user_profiles` table with columns: `id`, `name`, `avatar`, `role`, `created_at`, `updated_at`
- Proper RLS (Row Level Security) policies configured
