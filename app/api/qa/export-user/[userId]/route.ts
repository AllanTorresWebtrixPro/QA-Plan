import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/qa/export-user/[userId]
 * Export results for a specific user
 */
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from("qa_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch tests
    const { data: tests, error: testsError } = await supabase
      .from("qa_tests")
      .select("*")
      .order("category", { ascending: true });

    if (testsError) {
      return NextResponse.json({ error: testsError.message }, { status: 500 });
    }

    // Fetch user progress
    const { data: progress, error: progressError } = await supabase
      .from("qa_user_test_progress")
      .select("*")
      .eq("user_id", userId);

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message },
        { status: 500 }
      );
    }

    // Generate CSV data
    const csvData = generateUserCSV(user, tests, progress || []);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="qa-results-${user.name}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateUserCSV(user: any, tests: any[], progress: any[]): string {
  const headers = [
    "User",
    "Test ID",
    "Test Title",
    "Category",
    "Priority",
    "Completed",
    "Completed At",
    "Notes",
    "Expected Result",
  ];

  const rows = tests.map((test) => {
    const userProgress = progress.find((p) => p.test_id === test.id);
    return [
      user.name,
      test.id,
      test.title,
      test.category,
      test.priority,
      userProgress?.completed ? "Yes" : "No",
      userProgress?.completed_at || "",
      userProgress?.notes || "",
      test.expected,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
