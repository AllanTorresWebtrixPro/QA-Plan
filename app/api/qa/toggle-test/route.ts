import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/qa/toggle-test
 * Toggle test completion status for a user
 */
export async function POST(request: Request) {
  try {
    const { userId, testId, completed } = await request.json();

    if (!userId || !testId) {
      return NextResponse.json(
        { error: "Missing required fields: userId and testId" },
        { status: 400 }
      );
    }

    // Check if progress record exists
    const { data: existingProgress, error: checkError } = await supabase
      .from("qa_user_test_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("test_id", testId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingProgress) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("qa_user_test_progress")
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("test_id", testId);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from("qa_user_test_progress")
        .insert({
          id: `${userId}-${testId}`,
          user_id: userId,
          test_id: testId,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling test completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
