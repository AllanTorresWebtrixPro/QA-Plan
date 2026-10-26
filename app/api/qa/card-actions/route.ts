import { NextRequest, NextResponse } from "next/server";
import { createBasecampService } from "@/services/basecamp-service";
import { dbClient } from "@/lib/db/query";


const supabase = dbClient;

export async function POST(request: NextRequest) {
  try {
    const { cardId, action, testId, userId } = await request.json();

    if (!cardId || !action || !testId || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: cardId, action, testId, userId" },
        { status: 400 }
      );
    }

    // Check if this is a misc issue (testId starts with 'misc-')
    const isMiscIssue = testId.startsWith('misc-');

    const basecampService = createBasecampService("default_user");

    if (action === "accept") {
      // Move card to "Done" column and mark as completed
      console.log(`Accepting card ${cardId}, moving to Done column`);
      
      // Use hardcoded column IDs based on the Basecamp interface
      // These IDs are from the card table columns we can see in the UI
      const doneColumnId = "8903244482"; // "Done" column ID
      
      // Move the card to Done column
      const moveResponse = await basecampService.moveCard(
        basecampService.getProjectId(),
        cardId,
        doneColumnId
      );

      if (!moveResponse.success) {
        return NextResponse.json(
          { success: false, error: `Failed to move card: ${moveResponse.error}` },
          { status: 500 }
        );
      }

      // If this is a misc issue, update the issue status to "Resolved"
      if (isMiscIssue) {
        try {
          const { error: updateError } = await supabase
            .from("qa_misc_issues")
            .update({ status: "Resolved" })
            .eq("id", testId);

          if (updateError) {
            console.error("Error updating misc issue status:", updateError);
            // Don't fail the whole operation, just log the error
          }
        } catch (error) {
          console.error("Error updating misc issue status:", error);
        }
      }

      return NextResponse.json({ success: true, message: "Card accepted and moved to Done" });

    } else if (action === "reject") {
      // Move card to "In Progress" column
      console.log(`Rejecting card ${cardId}, moving to In Progress column`);
      
      // Use hardcoded column IDs based on the Basecamp interface
      const inProgressColumnId = "8920761150"; // "In Progress" column ID (this one was already correct)
      
      // Move the card to In Progress column
      const moveResponse = await basecampService.moveCard(
        basecampService.getProjectId(),
        cardId,
        inProgressColumnId
      );

      if (!moveResponse.success) {
        return NextResponse.json(
          { success: false, error: `Failed to move card: ${moveResponse.error}` },
          { status: 500 }
        );
      }

      // If this is a misc issue, update the issue status to "In Progress"
      if (isMiscIssue) {
        try {
          const { error: updateError } = await supabase
            .from("qa_misc_issues")
            .update({ status: "In Progress" })
            .eq("id", testId);

          if (updateError) {
            console.error("Error updating misc issue status:", updateError);
            // Don't fail the whole operation, just log the error
          }
        } catch (error) {
          console.error("Error updating misc issue status:", error);
        }
      }

      return NextResponse.json({ success: true, message: "Card rejected and moved to In Progress" });

    } else if (action === "delete") {
      // Delete the card from Basecamp
      console.log(`Deleting card ${cardId}`);
      
      const deleteResponse = await basecampService.deleteCard(cardId);

      if (!deleteResponse.success) {
        return NextResponse.json(
          { success: false, error: `Failed to delete card: ${deleteResponse.error}` },
          { status: 500 }
        );
      }

      // If this is a misc issue, remove the card ID from the issue
      if (isMiscIssue) {
        try {
          // First get the current card IDs
          const { data: issue, error: fetchError } = await supabase
            .from("qa_misc_issues")
            .select("basecamp_card_ids")
            .eq("id", testId)
            .single();

          if (!fetchError && issue?.basecamp_card_ids) {
            const updatedCardIds = issue.basecamp_card_ids.filter((id: string) => id !== cardId);
            
            const { error: updateError } = await supabase
              .from("qa_misc_issues")
              .update({ basecamp_card_ids: updatedCardIds })
              .eq("id", testId);

            if (updateError) {
              console.error("Error updating misc issue card IDs:", updateError);
            }
          }
        } catch (error) {
          console.error("Error updating misc issue card IDs:", error);
        }
      }

      return NextResponse.json({ success: true, message: "Card deleted successfully" });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'accept', 'reject', or 'delete'" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error in card actions API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 