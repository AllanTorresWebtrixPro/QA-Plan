/**
 * QA Service
 *
 * Service layer for handling QA-related data operations.
 * Uses the API client to communicate with the backend API routes.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface TestItem {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  steps: string[];
  expected: string;
  edgeCases: string[];
  completed?: boolean;
  completedAt?: string;
  notes?: string;
}

export interface UserTestProgress {
  id: string;
  user_id: string;
  test_id: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseStatus {
  connected: boolean;
  userCount?: number;
  error?: string;
}

export interface TestStats {
  completed: number;
  total: number;
  percentage: number;
  highPriorityRemaining: number;
}

export interface UserStats {
  user: User;
  completed: number;
  total: number;
  percentage: number;
}

/**
 * Fetch all tests from the database
 */
export async function fetchTests(): Promise<TestItem[]> {
  const response = await apiGet<TestItem[]>("/qa/tests");
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch tests");
  }
  return response.data;
}

/**
 * Fetch all users from the database
 */
export async function fetchUsers(): Promise<User[]> {
  const response = await apiGet<User[]>("/qa/users");
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch users");
  }
  return response.data;
}

/**
 * Fetch user test progress from the database
 */
export async function fetchUserProgress(): Promise<UserTestProgress[]> {
  const response = await apiGet<UserTestProgress[]>("/qa/user-progress");
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch user progress");
  }
  return response.data;
}

/**
 * Toggle test completion status
 */
export async function toggleTestCompletion(
  userId: string,
  testId: string,
  completed: boolean
): Promise<void> {
  const response = await apiPost("/qa/toggle-test", {
    userId,
    testId,
    completed,
  });
  if (!response.success) {
    throw new Error(response.error || "Failed to toggle test completion");
  }
}

/**
 * Add or update test notes
 */
export async function addTestNote(
  userId: string,
  testId: string,
  notes: string
): Promise<void> {
  const response = await apiPost("/qa/add-note", {
    userId,
    testId,
    notes,
  });
  if (!response.success) {
    throw new Error(response.error || "Failed to add test note");
  }
}

/**
 * Verify database connection
 */
export async function verifyDatabaseConnection(): Promise<DatabaseStatus> {
  const response = await apiGet<DatabaseStatus>("/qa/database-status");
  if (!response.success || !response.data) {
    return {
      connected: false,
      error: response.error || "Failed to verify database connection",
    };
  }
  return response.data;
}

/**
 * Export user results
 */
export async function exportUserResults(userId: string): Promise<string> {
  const response = await apiGet<{ data: string }>(`/qa/export-user/${userId}`);
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to export user results");
  }
  return response.data.data;
}

/**
 * Export all users results
 */
export async function exportAllUsersResults(): Promise<string> {
  const response = await apiGet<{ data: string }>("/qa/export-all-users");
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to export all users results");
  }
  return response.data.data;
}
