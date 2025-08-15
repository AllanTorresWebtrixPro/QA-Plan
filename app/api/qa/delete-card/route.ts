import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createBasecampService } from "@/services/basecamp-service";

// Use service role key for database operations that need to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * DELETE /api/qa/delete-card
 * Delete a Basecamp card from both the database and Basecamp
 */
export async function DELETE(request: Request) {
  try {
    const { cardId, testId, userId } = await request.json();

    if (!cardId || !testId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: cardId, testId, and userId" },
        { status: 400 }
      );
    }

    console.log(`Deleting card ${cardId} for test ${testId} and user ${userId}`);

    // Step 1: Delete the card from Basecamp
    let basecampDeleteSuccess = false;
    let basecampError = null;

    try {
      const basecampService = createBasecampService("default_user");
      const deleteResponse = await basecampService.deleteCard(cardId);

      if (deleteResponse.success) {
        basecampDeleteSuccess = true;
        console.log(`Basecamp card ${cardId} deleted successfully`);
      } else {
        basecampError = deleteResponse.error;
        console.error(`Failed to delete Basecamp card ${cardId}:`, deleteResponse.error);
      }
    } catch (basecampError) {
      console.error(`Error deleting Basecamp card ${cardId}:`, basecampError);
      basecampError = basecampError instanceof Error ? basecampError.message : "Unknown error";
    }

    // Step 2: Remove the card ID from the database
    let dbUpdateSuccess = false;
    let dbError = null;

    try {
      // Get the current progress record
      const { data: progressRecord, error: fetchError } = await supabaseAdmin
        .from("qa_user_test_progress")
        .select("basecamp_card_ids")
        .eq("user_id", userId)
        .eq("test_id", testId)
        .single();

      if (fetchError) {
        dbError = fetchError.message;
        console.error("Error fetching progress record:", fetchError);
      } else if (progressRecord) {
        // Remove the card ID from the array
        const currentCardIds = progressRecord.basecamp_card_ids || [];
        const updatedCardIds = currentCardIds.filter((id: string) => id !== cardId);

        // Update the record with the filtered array
        const { error: updateError } = await supabaseAdmin
          .from("qa_user_test_progress")
          .update({ 
            basecamp_card_ids: updatedCardIds,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", userId)
          .eq("test_id", testId);

        if (updateError) {
          dbError = updateError.message;
          console.error("Error updating progress record:", updateError);
        } else {
          dbUpdateSuccess = true;
          console.log(`Card ID ${cardId} removed from database for test ${testId}`);
        }
      }
    } catch (dbError) {
      console.error("Error updating database:", dbError);
      dbError = dbError instanceof Error ? dbError.message : "Unknown error";
    }

    // Return success if database was updated (Basecamp delete might fail due to permissions)
    if (dbUpdateSuccess) {
      return NextResponse.json({
        success: true,
        basecampDeleted: basecampDeleteSuccess,
        dbUpdated: dbUpdateSuccess,
        basecampError: basecampError || undefined,
        dbError: dbError || undefined,
        message: basecampError ? 
          "Card removed from database. Basecamp deletion failed (may require manual cleanup in Basecamp)" : 
          "Card deleted successfully from both Basecamp and database"
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to delete card from database",
        basecampError,
        dbError,
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 