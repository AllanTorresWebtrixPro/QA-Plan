import { NextResponse } from "next/server";
import { dbClient } from "@/lib/db/query";
import { cookies } from "next/headers";

const supabase = dbClient;

/**
 * GET /api/qa/users
 * Fetch all users from the database
 */
export async function GET() {
  try {
    // For now, let's use the service role key to bypass RLS for testing
    const adminSupabase = dbClient;

    const { data: usersData, error: usersError } = await adminSupabase
      .from("user_profiles")
      .select("*")
      .order("name", { ascending: true });

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    return NextResponse.json(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
