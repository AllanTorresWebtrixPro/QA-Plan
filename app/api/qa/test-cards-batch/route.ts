import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/qa/test-cards-batch
 * Fetch Basecamp cards for multiple tests at once
 */
export async function POST(request: Request) {
  try {
    const { testIds } = await request.json();

    if (!testIds || !Array.isArray(testIds)) {
      return NextResponse.json(
        { error: "testIds array is required" },
        { status: 400 }
      );
    }

    // Fetch cards for all test IDs in one query
    const { data: cardsData, error: cardsError } = await supabase
      .from("basecamp_cards")
      .select("*")
      .in("test_id", testIds);

    if (cardsError) {
      console.error("Error fetching cards:", cardsError);
      return NextResponse.json(
        { error: cardsError.message },
        { status: 500 }
      );
    }

    // Group cards by test_id
    const cardsByTestId: Record<string, any[]> = {};
    testIds.forEach(testId => {
      cardsByTestId[testId] = [];
    });

    cardsData?.forEach(card => {
      if (cardsByTestId[card.test_id]) {
        cardsByTestId[card.test_id].push(card);
      }
    });

    return NextResponse.json({
      success: true,
      data: cardsByTestId
    });

  } catch (error) {
    console.error("Error in batch cards API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
