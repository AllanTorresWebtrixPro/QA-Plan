import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/qa/export-all-users
 * Export results for all users
 */
export async function GET() {
  try {
    // Fetch all users
    const { data: users, error: usersError } = await supabase
      .from("user_profiles")
      .select("*")
      .order("name", { ascending: true });

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // Fetch all tests
    const { data: tests, error: testsError } = await supabase
      .from("qa_tests")
      .select("*")
      .order("category", { ascending: true });

    if (testsError) {
      return NextResponse.json({ error: testsError.message }, { status: 500 });
    }

    // Fetch all user progress
    const { data: progress, error: progressError } = await supabase
      .from("qa_user_test_progress")
      .select("*");

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message },
        { status: 500 }
      );
    }

    // Generate CSV data
    const csvData = generateAllUsersCSV(users, tests, progress || []);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="qa-results-all-users.csv"',
      },
    });
  } catch (error) {
    console.error("Error exporting all users results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateAllUsersCSV(
  users: any[],
  tests: any[],
  progress: any[]
): string {
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

  const rows: string[][] = [];

  users.forEach((user) => {
    tests.forEach((test) => {
      const userProgress = progress.find(
        (p) => p.user_id === user.id && p.test_id === test.id
      );

      rows.push([
        user.name,
        test.id,
        test.title,
        test.category,
        test.priority,
        userProgress?.completed ? "Yes" : "No",
        userProgress?.completed_at || "",
        userProgress?.notes || "",
        test.expected,
      ]);
    });
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
