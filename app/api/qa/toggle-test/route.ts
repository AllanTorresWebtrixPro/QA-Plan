import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/qa/toggle-test
 * Toggle the disabled status of a test (admin only)
 */
export async function POST(request: Request) {
  try {
    const { testId, userId } = await request.json();

    if (!testId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: testId and userId" },
        { status: 400 }
      );
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    if (userProfile.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can toggle test status" },
        { status: 403 }
      );
    }

    // Call the database function to toggle the test status
    const { data, error } = await supabase.rpc("toggle_test_disabled_status", {
      test_id: testId,
      user_id: userId,
    });

    if (error) {
      console.error("Error toggling test status:", error);
      return NextResponse.json(
        { error: "Failed to toggle test status" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Test not found or operation failed" },
        { status: 404 }
      );
    }

    // Get the updated test data
    const { data: updatedTest, error: fetchError } = await supabase
      .from("qa_tests")
      .select("*")
      .eq("id", testId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated test:", fetchError);
      return NextResponse.json(
        { error: "Test toggled but failed to fetch updated data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      test: updatedTest,
      message: `Test ${updatedTest.disabled ? "disabled" : "enabled"} successfully`,
    });
  } catch (error) {
    console.error("Error in toggle-test API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
