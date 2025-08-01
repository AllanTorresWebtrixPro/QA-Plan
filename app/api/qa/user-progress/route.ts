import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/qa/user-progress
 * Fetch all user test progress from the database
 */
export async function GET() {
  try {
    const { data: progressData, error: progressError } = await supabase
      .from("qa_user_test_progress")
      .select("*")
      .order("updated_at", { ascending: false });

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(progressData || []);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
