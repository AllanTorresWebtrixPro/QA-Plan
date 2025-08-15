import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createBasecampService } from "@/services/basecamp-service";
import { getTestById, getUserById } from "@/services/qa-service";

// Use anon key for general operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Use service role key for database operations that need to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

    // Check if the test exists (either in test_assignments or qa_tests)
    const testInfo = await getTestById(testId);
    const testExists = !!testInfo;

    let basecampCardCreated = false;
    let basecampError = null;
    let basecampCardId = null;

    // Try to create Basecamp card if environment variables are configured
    try {
      // Use default_user for Basecamp service since the current user might not have tokens
      const basecampService = createBasecampService("default_user");

      // Get user information for the card
      const userInfo = await getUserById(userId);

      const testTitle = testInfo?.title || `Test ${testId}`;
      const userName = userInfo?.name || userId;
      const cardData = {
        title: testTitle,
        content: notes,
        due_on: new Date().toISOString(),
      };
      // Create Basecamp card
      const basecampResponse = await basecampService.createTestCard(
        userId,
        testId,
        notes,
        testTitle
      );

      if (basecampResponse.success) {
        basecampCardCreated = true;
        basecampCardId = basecampResponse.data?.id;
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

    // Only save to database if the test exists
    if (testExists) {
      if (existingProgress) {
        // Update existing record
        let updateData: any = {
          notes,
          updated_at: new Date().toISOString(),
        };

        // Add Basecamp card ID to the array if a card was created
        if (basecampCardId) {
          const currentCardIds = existingProgress.basecamp_card_ids || [];
          if (!currentCardIds.includes(basecampCardId)) {
            updateData.basecamp_card_ids = [...currentCardIds, basecampCardId];
          }
        }

        const { error: updateError } = await supabase
          .from("qa_user_test_progress")
          .update(updateData)
          .eq("user_id", userId)
          .eq("test_id", testId);

        if (updateError) {
          console.error("Error updating progress:", updateError);
          // Don't return error, just log it
        }
      } else {
        // Create new record
        const insertData: any = {
          id: `${userId}-${testId}`,
          user_id: userId,
          test_id: testId,
          completed: false,
          notes,
        };

        // Add Basecamp card ID to the array if a card was created
        if (basecampCardId) {
          insertData.basecamp_card_ids = [basecampCardId];
        }

        const { error: insertError } = await supabase
          .from("qa_user_test_progress")
          .insert(insertData);

        if (insertError) {
          console.error("Error inserting progress:", insertError);
          // Don't return error, just log it
        }
      }
    } else {
      console.log(`Test ${testId} does not exist in database, skipping database save`);
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
