# Refactored QA Plan Architecture

This document describes the refactored architecture of the QA Plan application, which now uses @tanstack/react-query for data management and follows a clean separation of concerns.

## Architecture Overview

The application has been refactored to follow modern React patterns with:

- **@tanstack/react-query** for data fetching and caching
- **Server/Client component separation** for optimal performance
- **Service layer** for API communication
- **Custom hooks** for reusable data logic
- **API routes** for server-side data handling

## File Structure

```
├── app/
│   ├── api/qa/                    # API routes
│   │   ├── tests/route.ts         # Fetch tests
│   │   ├── users/route.ts         # Fetch users
│   │   ├── user-progress/route.ts # Fetch user progress
│   │   ├── toggle-test/route.ts   # Toggle test completion
│   │   ├── add-note/route.ts      # Add test notes
│   │   ├── database-status/route.ts # Check DB status
│   │   ├── export-user/[userId]/route.ts # Export user results
│   │   └── export-all-users/route.ts # Export all users
│   ├── layout.tsx                 # Root layout with QueryClientProvider
│   └── page.tsx                   # Main page (server component)
├── components/
│   ├── providers/
│   │   └── query-client-provider.tsx # React Query provider
│   ├── server/electric-dashboard/
│   │   └── qa-dashboard-server.tsx   # Server component
│   ├── client/electric-dashboard/
│   │   └── qa-dashboard-client.tsx   # Client component
│   └── ui/                        # UI components (unchanged)
├── services/
│   ├── api-client.ts              # Generic API client
│   └── qa-service.ts              # QA-specific service functions
├── hooks/
│   └── use-qa-queries.ts          # Custom React Query hooks
└── [existing files...]
```

## Component Architecture

### 1. Server Components

**`components/server/electric-dashboard/qa-dashboard-server.tsx`**

- **Purpose**: Server-side component that handles layout and loading states
- **Responsibilities**:
  - Provides main layout structure
  - Handles Suspense boundaries
  - Renders loading skeletons
  - Delegates data fetching to client components

### 2. Client Components

**`components/client/electric-dashboard/qa-dashboard-client.tsx`**

- **Purpose**: Client-side component that handles data fetching and UI interactions
- **Responsibilities**:
  - Uses React Query hooks for data fetching
  - Manages component state
  - Handles user interactions
  - Renders the main UI (maintains existing design)

## Data Flow

```
1. Mock Data → 2. API Routes → 3. Service Layer → 4. Query Hooks → 5. Components
```

### 1. API Routes (`app/api/qa/`)

- **Server-side endpoints** that handle database operations
- **Authentication and validation** at the API level
- **Error handling** and proper HTTP status codes
- **CSV export functionality** for reporting

### 2. Service Layer (`services/`)

- **`api-client.ts`**: Generic HTTP client with error handling
- **`qa-service.ts`**: QA-specific service functions
- **Type safety** with TypeScript interfaces
- **Consistent error handling** across all API calls

### 3. Query Hooks (`hooks/use-qa-queries.ts`)

- **Custom React Query hooks** for each data operation
- **Automatic caching** and background refetching
- **Optimistic updates** for better UX
- **Error handling** and loading states

### 4. Components

- **Server components** for static content and layout
- **Client components** for interactive features
- **Skeleton loading** states for better UX
- **Maintained existing UI design**

## Key Features

### React Query Integration

**QueryClientProvider Configuration**:

```typescript
// components/providers/query-client-provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 2,
    },
  },
});
```

**Custom Hooks**:

- `useTests()` - Fetch all tests
- `useUsers()` - Fetch all users
- `useUserProgress()` - Fetch user progress
- `useDatabaseStatus()` - Check database connection
- `useToggleTestCompletion()` - Toggle test completion
- `useAddTestNote()` - Add test notes
- `useExportUserResults()` - Export user results
- `useExportAllUsersResults()` - Export all users

### Loading States

**Skeleton Components**:

- Used throughout the application for loading states
- Maintains layout during data fetching
- Provides smooth user experience

**Example**:

```typescript
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Skeleton className="h-10 w-96 mb-4" />
      {/* More skeleton elements */}
    </div>
  );
}
```

### Error Handling

**Comprehensive Error Handling**:

- API level error handling with proper HTTP status codes
- Service layer error transformation
- React Query error states
- User-friendly error messages

### Data Mutations

**Optimistic Updates**:

- Test completion toggles update immediately
- Notes are added with optimistic UI updates
- Background synchronization with server

**Example**:

```typescript
const toggleTestMutation = useMutation({
  mutationFn: ({ userId, testId, completed }) =>
    toggleTestCompletion(userId, testId, completed),
  onSuccess: () => {
    // Invalidate and refetch related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.userProgress });
  },
});
```

## API Endpoints

### GET Endpoints

- `GET /api/qa/tests` - Fetch all tests
- `GET /api/qa/users` - Fetch all users
- `GET /api/qa/user-progress` - Fetch user progress
- `GET /api/qa/database-status` - Check database status
- `GET /api/qa/export-user/[userId]` - Export user results
- `GET /api/qa/export-all-users` - Export all users

### POST Endpoints

- `POST /api/qa/toggle-test` - Toggle test completion
- `POST /api/qa/add-note` - Add test notes

## Benefits of Refactored Architecture

### 1. Performance

- **Server-side rendering** for initial page load
- **Client-side caching** with React Query
- **Optimistic updates** for better perceived performance
- **Background refetching** for data freshness

### 2. Maintainability

- **Separation of concerns** between server and client
- **Reusable service layer** for API communication
- **Type-safe** with TypeScript
- **Consistent error handling**

### 3. User Experience

- **Loading skeletons** during data fetching
- **Optimistic updates** for immediate feedback
- **Error boundaries** for graceful error handling
- **Maintained existing UI design**

### 4. Developer Experience

- **Hot reloading** for development
- **React Query DevTools** for debugging
- **Clear component responsibilities**
- **Comprehensive documentation**

## Migration Notes

### Preserved Features

- ✅ **Existing UI design** - No visual changes
- ✅ **All functionality** - All features work as before
- ✅ **Database integration** - Supabase connection maintained
- ✅ **User management** - User switching and progress tracking
- ✅ **Export functionality** - CSV export for reports
- ✅ **Test management** - Test completion and notes

### Improvements

- 🚀 **Better performance** - Caching and optimistic updates
- 🛡️ **Better error handling** - Comprehensive error states
- 🔄 **Real-time updates** - Background data synchronization
- 📱 **Better loading states** - Skeleton loading throughout
- 🧹 **Cleaner code** - Separation of concerns
- 📚 **Better documentation** - Clear component responsibilities

## Testing and Validation

The refactored application maintains full compatibility with the existing functionality:

1. **Database Connection**: Verified working with existing Supabase setup
2. **User Management**: All user switching and progress tracking works
3. **Test Management**: Test completion and notes functionality preserved
4. **Export Features**: CSV export for individual and all users
5. **UI Consistency**: No visual changes to the existing design

## Future Enhancements

The new architecture provides a solid foundation for future enhancements:

- **Real-time updates** with WebSocket integration
- **Offline support** with React Query's caching
- **Advanced filtering** and search capabilities
- **Analytics dashboard** with data visualization
- **Multi-language support** with internationalization
- **Advanced reporting** with custom date ranges

## Conclusion

The refactored architecture successfully modernizes the QA Plan application while maintaining all existing functionality and UI design. The use of @tanstack/react-query provides excellent data management capabilities, while the server/client component separation optimizes performance and maintainability.
