import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/qa/tests
 * Fetch all tests from the database
 */
export async function GET() {
  try {
    
    // First, get assigned tests from test_assignments view
    const { data: assignedTestsData, error: assignedTestsError } = await supabase
      .from("test_assignments")
      .select("*")
      .order("category", { ascending: true });

    if (assignedTestsError) {
      return NextResponse.json({ error: assignedTestsError.message }, { status: 500 });
    }

    // Then, get all tests from qa_tests table (including unassigned ones)
    const { data: allTestsData, error: allTestsError } = await supabase
      .from("qa_tests")
      .select("*")
      .order("category", { ascending: true });

    if (allTestsError) {
      return NextResponse.json({ error: allTestsError.message }, { status: 500 });
    }

    // Get all user progress for all tests (to show completion status for any user)
    const { data: allUserProgress, error: allProgressError } = await supabase
      .from("qa_user_test_progress")
      .select("*");

    if (allProgressError) {
      console.error("Error fetching all user progress:", allProgressError);
    }

    // Create maps for quick lookup
    const assignedTestsMap = new Map();
    assignedTestsData.forEach((test) => {
      assignedTestsMap.set(test.test_id, test);
    });

    // Create a map of all completion status by test_id
    const allCompletionMap = new Map();
    if (allUserProgress) {
      allUserProgress.forEach((progress: any) => {
        // If any user has completed this test, mark it as completed
        if (progress.completed) {
          allCompletionMap.set(progress.test_id, {
            completed: true,
            completed_at: progress.completed_at,
            notes: progress.notes
          });
        }
      });
    }

    // Transform all tests, using assigned data when available and any user's completion status
    const transformedTests = allTestsData.map((test) => {
      const assignedTest = assignedTestsMap.get(test.id);
      const anyUserCompletion = allCompletionMap.get(test.id);
      
      return {
        id: test.id,
        title: test.title,
        category: test.category,
        subcategory: test.subcategory, // Include subcategory for Settings filtering
        priority: test.priority,
        steps: Array.isArray(test.steps)
          ? test.steps
          : JSON.parse(test.steps || "[]"),
        expected: test.expected,
        edgeCases: Array.isArray(test.edge_cases)
          ? test.edge_cases
          : JSON.parse(test.edge_cases || "[]"),
        // Assignment information (use assigned data if available, otherwise null)
        assignedTo: assignedTest?.assigned_to || null,
        assignedAt: assignedTest?.assigned_at || null,
        assignedBy: assignedTest?.assigned_by || null,
        assignedUserName: assignedTest?.assigned_user_name || null,
        assignedUserAvatar: assignedTest?.assigned_user_avatar || null,
        assignedUserRole: assignedTest?.assigned_user_role || null,
        assignedByName: assignedTest?.assigned_by_name || null,
        // Use any user's completion status if available, otherwise fall back to assigned user's progress
        completed: anyUserCompletion ? anyUserCompletion.completed : (assignedTest?.completed || false),
        completedAt: anyUserCompletion ? anyUserCompletion.completed_at : (assignedTest?.completed_at || null),
        notes: anyUserCompletion ? anyUserCompletion.notes : (assignedTest?.notes || null),
      };
    });

    return NextResponse.json(transformedTests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
