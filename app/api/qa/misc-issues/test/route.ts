import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/qa/misc-issues/test
 * Test endpoint to check database connectivity and table existence
 */
export async function GET() {
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("qa_users")
      .select("count")
      .limit(1);

    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        details: connectionError.message
      }, { status: 500 });
    }

    // Test misc_issues table existence
    const { data: miscIssuesTest, error: miscIssuesError } = await supabase
      .from("qa_misc_issues")
      .select("count")
      .limit(1);

    if (miscIssuesError) {
      return NextResponse.json({
        success: false,
        error: "Misc issues table not found or not accessible",
        details: miscIssuesError.message,
        suggestion: "Run the migration: yarn migrate:misc-issues"
      }, { status: 500 });
    }

    // Test misc_issues_with_users view
    const { data: viewTest, error: viewError } = await supabase
      .from("misc_issues_with_users")
      .select("count")
      .limit(1);

    if (viewError) {
      return NextResponse.json({
        success: false,
        error: "Misc issues view not found",
        details: viewError.message,
        suggestion: "Run the migration: yarn migrate:misc-issues"
      }, { status: 500 });
    }

    // Get actual counts
    const { count: totalIssues } = await supabase
      .from("qa_misc_issues")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      message: "Database connectivity and table structure verified",
      data: {
        connection: "OK",
        miscIssuesTable: "OK",
        miscIssuesView: "OK",
        totalIssues: totalIssues || 0
      }
    });

  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json({
      success: false,
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
