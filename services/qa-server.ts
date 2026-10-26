import "server-only";
import { dbClient } from "@/lib/db/query";

const supabase = dbClient;

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
          const adminSupabase = dbClient;
          
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
