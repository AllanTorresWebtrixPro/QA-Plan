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
    const { data: testsData, error: testsError } = await supabase
      .from("test_assignments")
      .select("*")
      .order("category", { ascending: true });

    if (testsError) {
      return NextResponse.json({ error: testsError.message }, { status: 500 });
    }

    // Transform database data to match our interface
    const transformedTests = testsData.map((test) => ({
      id: test.test_id,
      title: test.title,
      category: test.category,
      priority: test.priority,
      steps: Array.isArray(test.steps)
        ? test.steps
        : JSON.parse(test.steps || "[]"),
      expected: test.expected,
      edgeCases: Array.isArray(test.edge_cases)
        ? test.edge_cases
        : JSON.parse(test.edge_cases || "[]"),
      // Assignment information
      assignedTo: test.assigned_to,
      assignedAt: test.assigned_at,
      assignedBy: test.assigned_by,
      assignedUserName: test.assigned_user_name,
      assignedUserAvatar: test.assigned_user_avatar,
      assignedUserRole: test.assigned_user_role,
      assignedByName: test.assigned_by_name,
      completed: test.completed || false,
      completedAt: test.completed_at,
      notes: test.notes,
    }));

    return NextResponse.json(transformedTests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
