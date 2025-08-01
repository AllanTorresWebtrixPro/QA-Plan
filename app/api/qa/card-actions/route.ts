import { NextRequest, NextResponse } from "next/server";
import { createBasecampService } from "@/services/basecamp-service";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { cardId, action, testId, userId } = await request.json();

    if (!cardId || !action || !testId || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: cardId, action, testId, userId" },
        { status: 400 }
      );
    }

    const basecampService = createBasecampService("default_user");

    if (action === "accept") {
      // Move card to "Done" column and mark as completed
      console.log(`Accepting card ${cardId}, moving to Done column`);
      
      // First, get the "Done" column ID
      const columnsResponse = await basecampService.getColumns(
        basecampService.getProjectId(),
        basecampService.getCardTableId()
      );

      if (!columnsResponse.success || !columnsResponse.data) {
        return NextResponse.json(
          { success: false, error: "Failed to get Basecamp columns" },
          { status: 500 }
        );
      }

      const doneColumn = columnsResponse.data.find((col: any) => col.name === "Done");
      if (!doneColumn) {
        return NextResponse.json(
          { success: false, error: "Done column not found in Basecamp" },
          { status: 500 }
        );
      }

      // Move the card to Done column
      const moveResponse = await basecampService.moveCard(
        basecampService.getProjectId(),
        cardId,
        doneColumn.id
      );

      if (!moveResponse.success) {
        return NextResponse.json(
          { success: false, error: `Failed to move card: ${moveResponse.error}` },
          { status: 500 }
        );
      }

      // Mark the test as completed in the database
      const { error: updateError } = await supabase
        .from("qa_user_test_progress")
        .update({ 
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .eq("test_id", testId);

      if (updateError) {
        console.error("Error updating test completion:", updateError);
        // Don't fail the request, just log the error
      }

      return NextResponse.json({ success: true, message: "Card accepted and moved to Done" });

    } else if (action === "reject") {
      // Move card to "In Progress" column
      console.log(`Rejecting card ${cardId}, moving to In Progress column`);
      
      // First, get the "In Progress" column ID
      const columnsResponse = await basecampService.getColumns(
        basecampService.getProjectId(),
        basecampService.getCardTableId()
      );

      if (!columnsResponse.success || !columnsResponse.data) {
        return NextResponse.json(
          { success: false, error: "Failed to get Basecamp columns" },
          { status: 500 }
        );
      }

      const inProgressColumn = columnsResponse.data.find((col: any) => col.name === "In Progress");
      if (!inProgressColumn) {
        return NextResponse.json(
          { success: false, error: "In Progress column not found in Basecamp" },
          { status: 500 }
        );
      }

      // Move the card to In Progress column
      const moveResponse = await basecampService.moveCard(
        basecampService.getProjectId(),
        cardId,
        inProgressColumn.id
      );

      if (!moveResponse.success) {
        return NextResponse.json(
          { success: false, error: `Failed to move card: ${moveResponse.error}` },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: "Card rejected and moved to In Progress" });

    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'accept' or 'reject'" },
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