/**
 * QA Service
 *
 * Service layer for handling QA-related data operations.
 * Uses the API client to communicate with the backend API routes.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Get test information by test ID
 */
export async function getTestById(testId: string) {
  try {
    // First try to get from test_assignments view (where dashboard gets data from)
    const { data: assignmentData, error: assignmentError } = await supabase
      .from("test_assignments")
      .select("*")
      .eq("test_id", testId)
      .single();

    if (!assignmentError && assignmentData) {
      console.log(`Found test in test_assignments: ${assignmentData.title}`);
      return {
        id: assignmentData.test_id,
        title: assignmentData.title,
        category: assignmentData.category,
        priority: assignmentData.priority,
        steps: Array.isArray(assignmentData.steps) 
          ? assignmentData.steps 
          : JSON.parse(assignmentData.steps || "[]"),
        expected: assignmentData.expected,
        edgeCases: Array.isArray(assignmentData.edge_cases) 
          ? assignmentData.edge_cases 
          : JSON.parse(assignmentData.edge_cases || "[]"),
      };
    }

    // Fallback to qa_tests table
    console.log(`Test not found in test_assignments, trying qa_tests table...`);
    const { data, error } = await supabase
      .from("qa_tests")
      .select("*")
      .eq("id", testId)
      .single();

    if (error) {
      console.error("Error fetching test:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getTestById:", error);
    return null;
  }
}

/**
 * Get user information by user ID
 */
export async function getUserById(userId: string) {
  try {
    console.log(`Looking up user: ${userId}`);
    
    // First try to get from user_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.log(`User profile not found for ${userId}, error:`, profileError);
      console.log(`Trying qa_users table...`);
      
      // Try qa_users table as fallback
      const { data: qaUserData, error: qaUserError } = await supabase
        .from("qa_users")
        .select("*")
        .eq("id", userId)
        .single();

      if (qaUserError) {
        console.log(`User not found in qa_users either for ${userId}, trying auth.users...`);
        
        // Try to get from auth.users table using service role
        try {
          const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );
          
          const { data: authUser, error: authError } = await adminSupabase.auth.admin.getUserById(userId);
          
          if (!authError && authUser?.user) {
            console.log(`Found user in auth.users:`, authUser.user);
            return {
              id: authUser.user.id,
              name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || `User ${userId.substring(0, 8)}`,
              email: authUser.user.email || `${userId}@example.com`,
              avatar: (authUser.user.user_metadata?.name || authUser.user.email || 'U').charAt(0).toUpperCase()
            };
          }
        } catch (authLookupError) {
          console.log(`Auth lookup failed:`, authLookupError);
        }
        
        // Final fallback
        console.log(`Using final fallback for ${userId}`);
        return {
          id: userId,
          name: userId === "default_user" ? "Default User" : `User ${userId.substring(0, 8)}`,
          email: userId === "default_user" ? "default@example.com" : `${userId}@example.com`,
          avatar: userId.charAt(0).toUpperCase()
        };
      }

      return {
        id: qaUserData.id,
        name: qaUserData.name,
        email: qaUserData.email || userId,
        avatar: qaUserData.avatar
      };
    }

    console.log(`Found user in user_profiles:`, profileData);
    return {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email || userId,
      avatar: profileData.avatar
    };
  } catch (error) {
    console.error("Error in getUserById:", error);
    // Return fallback user object on error
    return {
      id: userId,
      name: userId === "default_user" ? "Default User" : `User ${userId.substring(0, 8)}`,
      email: userId === "default_user" ? "default@example.com" : `${userId}@example.com`,
      avatar: userId.charAt(0).toUpperCase()
    };
  }
}

/**
 * Get test category information
 */
export async function getTestCategoryById(categoryId: string) {
  try {
    const { data, error } = await supabase
      .from("qa_test_categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (error) {
      console.error("Error fetching test category:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getTestCategoryById:", error);
    return null;
  }
}

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
}

export interface TestItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string; // For Settings subsections
  priority: "High" | "Medium" | "Low";
  steps: string[];
  expected: string;
  edgeCases: string[];
  completed?: boolean;
  completedAt?: string;
  notes?: string;
  // Assignment information
  assignedTo?: string;
  assignedAt?: string;
  assignedBy?: string;
  assignedUserName?: string;
  assignedUserAvatar?: string;
  assignedUserRole?: string;
  assignedByName?: string;
}

export interface UserTestProgress {
  id: string;
  user_id: string;
  test_id: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
  basecamp_card_ids?: string[];
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
 * Fetch all authenticated users from Supabase Auth
 */
export async function fetchAuthUsers(): Promise<User[]> {
  const response = await apiGet<User[]>("/qa/auth-users");
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch auth users");
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

// Test assignment functions
export async function assignTestToUser(testId: string, userId: string) {
  try {
    const response = await fetch('/api/qa/assign-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ testId, userId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to assign test');
    }

    return data;
  } catch (error) {
    console.error('Error assigning test:', error);
    throw error;
  }
}

export async function unassignTest(testId: string, userId: string) {
  try {
    const response = await fetch('/api/qa/assign-test', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ testId, userId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to unassign test');
    }

    return data;
  } catch (error) {
    console.error('Error unassigning test:', error);
    throw error;
  }
}

export async function canUserModifyTest(testId: string, userId: string) {
  try {
    const { data, error } = await supabase.rpc('can_modify_test_progress', {
      test_id: testId,
      user_id: userId
    });

    if (error) {
      console.error('Error checking test modification permission:', error);
      return false;
    }

    return data;
  } catch (error) {
    console.error('Error in canUserModifyTest:', error);
    return false;
  }
}
