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
export async function GET(request: Request) {
  try {
    // Get the current user ID from the request headers or query params
    const url = new URL(request.url);
    const currentUserId = url.searchParams.get('userId');
    
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

    // Get current user's progress for all tests
    let currentUserProgress = [];
    if (currentUserId) {
      const { data: progressData, error: progressError } = await supabase
        .from("qa_user_test_progress")
        .select("*")
        .eq("user_id", currentUserId);

      if (!progressError && progressData) {
        currentUserProgress = progressData;
      }
    }

    // Create maps for quick lookup
    const assignedTestsMap = new Map();
    assignedTestsData.forEach((test) => {
      assignedTestsMap.set(test.test_id, test);
    });

    const currentUserProgressMap = new Map();
    currentUserProgress.forEach((progress) => {
      currentUserProgressMap.set(progress.test_id, progress);
    });

    // Transform all tests, using assigned data when available and current user's progress
    const transformedTests = allTestsData.map((test) => {
      const assignedTest = assignedTestsMap.get(test.id);
      const userProgress = currentUserProgressMap.get(test.id);
      
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
        // Use current user's progress if available, otherwise fall back to assigned user's progress
        completed: userProgress ? userProgress.completed : (assignedTest?.completed || false),
        completedAt: userProgress ? userProgress.completed_at : (assignedTest?.completed_at || null),
        notes: userProgress ? userProgress.notes : (assignedTest?.notes || null),
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
