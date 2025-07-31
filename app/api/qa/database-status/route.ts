import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/qa/database-status
 * Check database connection status
 */
export async function GET() {
  try {
    // Test basic connection by counting users
    const { data: userCount, error: connectionError } = await supabase
      .from("qa_users")
      .select("count", { count: "exact", head: true });

    if (connectionError) {
      return NextResponse.json({
        connected: false,
        error: connectionError.message,
      });
    }

    return NextResponse.json({
      connected: true,
      userCount: userCount?.[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error checking database status:", error);
    return NextResponse.json({
      connected: false,
      error: "Internal server error",
    });
  }
}
