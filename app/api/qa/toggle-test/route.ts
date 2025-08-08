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
    
    console.log("toggle-test API received:", { userId, testId, completed });

    if (!userId || !testId) {
      console.error("Missing required fields:", { userId, testId });
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
      console.log("Updating existing progress record:", existingProgress);
      // Update existing record
      const updateData = {
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      console.log("Update data:", updateData);
      
      const { error: updateError } = await supabase
        .from("qa_user_test_progress")
        .update(updateData)
        .eq("user_id", userId)
        .eq("test_id", testId);

      if (updateError) {
        console.error("Update error:", updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
      console.log("Update successful");
    } else {
      console.log("Creating new progress record");
      // Create new record
      const insertData = {
        id: `${userId}-${testId}`,
        user_id: userId,
        test_id: testId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      };
      console.log("Insert data:", insertData);
      
      const { error: insertError } = await supabase
        .from("qa_user_test_progress")
        .insert(insertData);

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
      console.log("Insert successful");
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
