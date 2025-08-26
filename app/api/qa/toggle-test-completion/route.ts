import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/qa/toggle-test-completion
 * Toggle the completion status of a test for a specific user
 */
export async function POST(request: Request) {
  try {
    const { userId, testId, completed } = await request.json();

    if (!userId || !testId || completed === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: userId, testId, and completed" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if test exists
    const { data: test, error: testError } = await supabase
      .from("qa_tests")
      .select("id")
      .eq("id", testId)
      .single();

    if (testError || !test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Check if there's existing progress for this user and test
    const { data: existingProgress, error: progressError } = await supabase
      .from("qa_user_test_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("test_id", testId)
      .single();

    if (progressError && progressError.code !== "PGRST116") {
      console.error("Error checking existing progress:", progressError);
      return NextResponse.json(
        { error: "Failed to check existing progress" },
        { status: 500 }
      );
    }

    let result;
    if (existingProgress) {
      // Update existing progress
      const updateData = {
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("qa_user_test_progress")
        .update(updateData)
        .eq("id", existingProgress.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating test progress:", error);
        return NextResponse.json(
          { error: "Failed to update test progress" },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new progress record
      const newProgress = {
        id: `${userId}-${testId}`,
        user_id: userId,
        test_id: testId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("qa_user_test_progress")
        .insert([newProgress])
        .select()
        .single();

      if (error) {
        console.error("Error creating test progress:", error);
        return NextResponse.json(
          { error: "Failed to create test progress" },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      success: true,
      progress: result,
      message: `Test ${completed ? "marked as completed" : "marked as incomplete"} successfully`,
    });
  } catch (error) {
    console.error("Error in toggle-test-completion API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
