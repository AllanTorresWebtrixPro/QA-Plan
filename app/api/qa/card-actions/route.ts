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