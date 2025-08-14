/**
 * QA Query Hooks
 *
 * Custom React Query hooks for QA data operations.
 * These hooks provide data fetching, caching, and state management for the QA application.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTests,
  fetchUsers,
  fetchAuthUsers,
  fetchUserProgress,
  toggleTestCompletion,
  addTestNote,
  verifyDatabaseConnection,
  exportUserResults,
  exportAllUsersResults,
  type TestItem,
  type User,
  type UserTestProgress,
  type DatabaseStatus,
} from "@/services/qa-service";

// Query Keys
export const queryKeys = {
  tests: ["qa", "tests"] as const,
  users: ["qa", "users"] as const,
  authUsers: ["qa", "auth-users"] as const,
  userProgress: ["qa", "user-progress"] as const,
  databaseStatus: ["qa", "database-status"] as const,
  userStats: (userId: string) => ["qa", "user-stats", userId] as const,
  allUsersStats: ["qa", "all-users-stats"] as const,
};

/**
 * Hook to fetch all tests
 */
export function useTests() {
  return useQuery({
    queryKey: queryKeys.tests,
    queryFn: fetchTests,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch all users
 */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch all authenticated users from Supabase Auth
 */
export function useAuthUsers() {
  return useQuery({
    queryKey: queryKeys.authUsers,
    queryFn: fetchAuthUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch user progress
 */
export function useUserProgress() {
  return useQuery({
    queryKey: queryKeys.userProgress,
    queryFn: fetchUserProgress,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to verify database connection
 */
export function useDatabaseStatus() {
  return useQuery({
    queryKey: queryKeys.databaseStatus,
    queryFn: verifyDatabaseConnection,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook to toggle test completion
 */
export function useToggleTestCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      testId,
      completed,
    }: {
      userId: string;
      testId: string;
      completed: boolean;
    }) => toggleTestCompletion(userId, testId, completed),
    onSuccess: (data, variables) => {
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tests });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProgress });
      queryClient.invalidateQueries({ queryKey: queryKeys.allUsersStats });
      // Also invalidate the specific user's tests query
      queryClient.invalidateQueries({ queryKey: [...queryKeys.tests, variables.userId] });
    },
  });
}

/**
 * Hook to add test notes
 */
export function useAddTestNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      testId,
      notes,
    }: {
      userId: string;
      testId: string;
      notes: string;
    }) => addTestNote(userId, testId, notes),
    onSuccess: (data, variables) => {
      // Invalidate the specific queries that need to be updated
      queryClient.invalidateQueries({ queryKey: queryKeys.tests });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProgress });
      
      // Invalidate the specific test's Basecamp cards to show the newly created card
      queryClient.invalidateQueries({ 
        queryKey: ['test-cards', variables.testId] 
      });
    },
  });
}

/**
 * Hook to export user results
 */
export function useExportUserResults() {
  return useMutation({
    mutationFn: (userId: string) => exportUserResults(userId),
  });
}

/**
 * Hook to export all users results
 */
export function useExportAllUsersResults() {
  return useMutation({
    mutationFn: exportAllUsersResults,
  });
}

/**
 * Hook to get tests with user progress
 */
export function useTestsWithProgress(userId?: string) {
  const { data: tests = [], isLoading, error, refetch } = useTests();

  // Define disabled Settings subsections
  const disabledSettingsSubsections = [
    "Accessibility Testing",
    "Browser Compatibility", 
    "Performance Testing",
    "Security Testing",
    "Cross-Section Testing"
  ];

  // Filter out disabled Settings subsections and disabled tests
  const filteredTests = tests.filter(test => 
    // Exclude tests from disabled Settings subsections
    !(test.category === "Settings" && test.subcategory && disabledSettingsSubsections.includes(test.subcategory)) &&
    // Exclude tests that are marked as disabled
    !test.disabled
  );

  // The tests now come from the API with any user's completion status included
  // So we don't need to merge with userProgress anymore
  const testsWithProgress = filteredTests.map((test) => ({
    ...test,
    // The API now returns completed, completedAt, notes directly from the view
    completed: test.completed || false,
    completedAt: test.completedAt,
    notes: test.notes,
  }));

  return {
    data: testsWithProgress,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get current user statistics
 */
export function useCurrentUserStats(userId: string) {
  const testsWithProgress = useTestsWithProgress(userId);

  const completed = testsWithProgress.data.filter((t) => t.completed).length;
  const total = testsWithProgress.data.length;
  const highPriorityRemaining = testsWithProgress.data.filter(
    (t) => t.priority === "High" && !t.completed
  ).length;

  return {
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0,
    highPriorityRemaining,
  };
}

/**
 * Hook to get all users statistics
 */
export function useAllUsersStats() {
  const { data: users = [] } = useUsers();
  const { data: tests = [] } = useTests();
  const { data: userProgress = [] } = useUserProgress();

  // Define disabled Settings subsections
  const disabledSettingsSubsections = [
    "Accessibility Testing",
    "Browser Compatibility", 
    "Performance Testing",
    "Security Testing",
    "Cross-Section Testing"
  ];

  const allUsersStats = users.map((user) => {
    // Get all tests with progress for this user (same logic as useTestsWithProgress)
    const userTestsWithProgress = tests
      .filter(test => 
        // Exclude tests from disabled Settings subsections
        !(test.category === "Settings" && test.subcategory && disabledSettingsSubsections.includes(test.subcategory)) &&
        // Exclude tests that are marked as disabled
        !test.disabled
      )
      .map((test) => {
        const progress = userProgress.find(
          (p) => p.user_id === user.id && p.test_id === test.id
        );
        return {
          ...test,
          completed: progress?.completed || false,
          completedAt: progress?.completed_at,
          notes: progress?.notes,
        };
      });

    const completed = userTestsWithProgress.filter((t) => t.completed).length;
    const total = userTestsWithProgress.length; // This should be the same as total tests

    return {
      user,
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  });

  return allUsersStats;
}

/**
 * Hook to get all authenticated users statistics using Supabase Auth data
 */
export function useAllAuthUsersStats() {
  const { data: authUsers = [] } = useAuthUsers();
  const { data: tests = [] } = useTests();
  const { data: userProgress = [] } = useUserProgress();

  // Define disabled Settings subsections
  const disabledSettingsSubsections = [
    "Accessibility Testing",
    "Browser Compatibility", 
    "Performance Testing",
    "Security Testing",
    "Cross-Section Testing"
  ];

  const allAuthUsersStats = authUsers.map((user) => {
    // Get all tests with progress for this user (same logic as useTestsWithProgress)
    const userTestsWithProgress = tests
      .filter(test => 
        // Exclude tests from disabled Settings subsections
        !(test.category === "Settings" && test.subcategory && disabledSettingsSubsections.includes(test.subcategory)) &&
        // Exclude tests that are marked as disabled
        !test.disabled
      )
      .map((test) => {
        const progress = userProgress.find(
          (p) => p.user_id === user.id && p.test_id === test.id
        );
        return {
          ...test,
          completed: progress?.completed || false,
          completedAt: progress?.completed_at,
          notes: progress?.notes,
        };
      });

    const completed = userTestsWithProgress.filter((t) => t.completed).length;
    const total = userTestsWithProgress.length; // This should be the same as total tests

    return {
      user,
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  });

  return allAuthUsersStats;
}


