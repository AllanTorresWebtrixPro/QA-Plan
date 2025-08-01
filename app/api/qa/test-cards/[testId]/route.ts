import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createBasecampService } from "@/services/basecamp-service";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple in-memory cache to prevent repeated API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;

    // Check cache first
    const cacheKey = `test-cards-${testId}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Fetch progress records that have Basecamp card IDs for this test
    const { data: progressRecords, error } = await supabase
      .from("qa_user_test_progress")
      .select("basecamp_card_ids, user_id")
      .eq("test_id", testId)
      .not("basecamp_card_ids", "is", null);

    if (error) {
      console.error("Error fetching progress records:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch progress records" },
        { status: 500 }
      );
    }

    // Collect all Basecamp card IDs
    const allCardIds: string[] = [];
    progressRecords?.forEach((record: any) => {
      if (record.basecamp_card_ids && Array.isArray(record.basecamp_card_ids)) {
        allCardIds.push(...record.basecamp_card_ids);
      }
    });

    // Remove duplicates
    const uniqueCardIds = [...new Set(allCardIds)];

    console.log("Looking for card IDs:", uniqueCardIds);

    if (uniqueCardIds.length === 0) {
      console.log("No card IDs found for test:", testId);
      const result = {
        success: true,
        cards: []
      };
      
      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return NextResponse.json(result);
    }

    // Try to get Basecamp cards if environment variables are configured
    try {
      console.log("Creating Basecamp service...");
      const basecampService = createBasecampService("default_user");
      
      // Try to get the specific card by ID since we know it exists
      console.log("Trying to get specific card by ID...");
      
      const cards: any[] = [];
      
      for (const cardId of uniqueCardIds) {
        console.log(`Fetching card ${cardId}...`);
        
        // Try to get the card directly by ID
        const cardResponse = await basecampService.getCardById(cardId);
        
        if (cardResponse.success && cardResponse.data) {
          console.log(`Found card ${cardId}:`, cardResponse.data);
          
          // Get column information for this card
          const columnResponse = await basecampService.getColumns(
            basecampService.getProjectId(),
            basecampService.getCardTableId()
          );
          
          // Use the card's parent title directly since the columns API is failing
          let columnName = cardResponse.data.parent?.title || "To Do";
          console.log("Using column name from card parent:", columnName);
          
          cards.push({
            id: cardResponse.data.id,
            title: cardResponse.data.title,
            content: cardResponse.data.content,
            column_id: cardResponse.data.parent?.id,
            column_name: columnName,
            created_at: cardResponse.data.created_at,
            updated_at: cardResponse.data.updated_at,
            url: cardResponse.data.app_url
          });
        } else {
          console.error(`Failed to get card ${cardId}:`, cardResponse.error);
        }
      }
      
      console.log(`Found ${cards.length} cards`);
      
      const cardsWithColumns = cards;

               const result = {
         success: true,
         cards: cardsWithColumns,
       };
       
       // Cache the result
       cache.set(cacheKey, { data: result, timestamp: Date.now() });
       
       return NextResponse.json(result);
    } catch (basecampConfigError) {
      console.error(
        "Basecamp integration not configured or failed:",
        basecampConfigError
      );
      return NextResponse.json({
        success: false,
        error: "Basecamp integration not configured",
        cards: [],
      });
    }

  } catch (error) {
    console.error("Error in test-cards API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 