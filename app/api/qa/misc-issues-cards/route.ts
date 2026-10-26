import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db/query";
import { createBasecampService } from "@/services/basecamp-service";


const supabase = dbClient;

// Simple in-memory cache to prevent repeated API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 1000; // 30 seconds (reduced for better responsiveness)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const issueId = searchParams.get('issueId'); // Optional: specific issue ID
    const refresh = searchParams.get('refresh'); // Optional: force refresh

    // Check cache first (skip if refresh is requested)
    const cacheKey = `misc-issues-cards-${issueId || 'all'}`;
    const cached = cache.get(cacheKey);
    if (!refresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Build query for misc issues with Basecamp card IDs
    let query = supabase
      .from("qa_misc_issues")
      .select("id, title, basecamp_card_ids")
      .not("basecamp_card_ids", "is", null);

    // If specific issue ID is provided, filter by it
    if (issueId) {
      query = query.eq("id", issueId);
    }

    const { data: miscIssues, error } = await query;

    if (error) {
      console.error("Error fetching misc issues:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch misc issues" },
        { status: 500 }
      );
    }

    // Collect all Basecamp card IDs
    const allCardIds: string[] = [];
    miscIssues?.forEach((issue: any) => {
      if (issue.basecamp_card_ids && Array.isArray(issue.basecamp_card_ids)) {
        allCardIds.push(...issue.basecamp_card_ids);
      }
    });

    // Remove duplicates
    const uniqueCardIds = [...new Set(allCardIds)];

    console.log("Looking for misc issue card IDs:", uniqueCardIds);

    if (uniqueCardIds.length === 0) {
      console.log("No card IDs found for misc issues");
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
      console.log("Creating Basecamp service for misc issues...");
      const basecampService = createBasecampService("default_user");
      
      const cards: any[] = [];
      
      for (const cardId of uniqueCardIds) {
        console.log(`Fetching misc issue card ${cardId}...`);
        
        // Try to get the card directly by ID
        const cardResponse = await basecampService.getCardById(cardId);
        
        if (cardResponse.success && cardResponse.data) {
          console.log(`Found misc issue card ${cardId}:`, cardResponse.data);
          
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
          console.error(`Failed to get misc issue card ${cardId}:`, cardResponse.error);
        }
      }
      
      console.log(`Found ${cards.length} misc issue cards`);
      
      const result = {
        success: true,
        cards: cards,
      };
      
      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return NextResponse.json(result);
    } catch (basecampConfigError) {
      console.error(
        "Basecamp integration not configured or failed for misc issues:",
        basecampConfigError
      );
      return NextResponse.json({
        success: false,
        error: "Basecamp integration not configured",
        cards: [],
      });
    }

  } catch (error) {
    console.error("Error in misc-issues-cards API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
