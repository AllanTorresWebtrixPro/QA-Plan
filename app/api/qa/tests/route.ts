import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/qa/tests
 * Fetch all tests from the database
 */
export async function GET() {
  try {
    const { data: testsData, error: testsError } = await supabase
      .from("qa_tests")
      .select("*")
      .order("category", { ascending: true });

    if (testsError) {
      return NextResponse.json({ error: testsError.message }, { status: 500 });
    }

    // Transform database data to match our interface
    const transformedTests = testsData.map((test) => ({
      id: test.id,
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
