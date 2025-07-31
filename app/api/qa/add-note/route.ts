import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createBasecampService } from "@/services/basecamp-service";
import { getTestById, getUserById } from "@/services/qa-service";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/qa/add-note
 * Add or update test notes for a user and create Basecamp card
 */
export async function POST(request: Request) {
  try {
    const { userId, testId, notes } = await request.json();

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

    let basecampCardCreated = false;
    let basecampError = null;

    // Try to create Basecamp card if environment variables are configured
    try {
      const basecampService = createBasecampService();

      // Get additional information for the card
      const [testInfo, userInfo] = await Promise.all([
        getTestById(testId),
        getUserById(userId),
      ]);

      const testTitle = testInfo?.title || testId;
      const userName = userInfo?.name || userId;

      // Create Basecamp card
      const basecampResponse = await basecampService.createTestCard(
        userId,
        testId,
        notes,
        testTitle
      );

      if (basecampResponse.success) {
        basecampCardCreated = true;
        console.log(
          "Basecamp card created successfully:",
          basecampResponse.data
        );
      } else {
        basecampError = basecampResponse.error;
        console.error(
          "Failed to create Basecamp card:",
          basecampResponse.error
        );
      }
    } catch (basecampConfigError) {
      console.warn(
        "Basecamp integration not configured or failed:",
        basecampConfigError
      );
      // Continue with the note saving even if Basecamp fails
    }

    if (existingProgress) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("qa_user_test_progress")
        .update({
          notes,
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
          completed: false,
          notes,
        });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      basecampCardCreated,
      basecampError: basecampError ? basecampError : undefined,
    });
  } catch (error) {
    console.error("Error adding test note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
