import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/qa/auth-users
 * Fetch all authenticated users from Supabase Auth and their profiles
 */
export async function GET() {
  try {
    // Get all users from Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Get user profiles for all authenticated users
    const { data: userProfiles, error: profilesError } = await supabase
      .from("user_profiles")
      .select("*");

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    // Combine auth users with their profiles
    const usersWithProfiles = authUsers.users
      .filter(user => user.email_confirmed_at) // Only include confirmed users
      .map(authUser => {
        const profile = userProfiles?.find(p => p.id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email,
          name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Unknown User',
          avatar: profile?.avatar || (authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'U').substring(0, 2).toUpperCase(),
          role: profile?.role || 'tester',
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          confirmed_at: authUser.email_confirmed_at
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(usersWithProfiles);
  } catch (error) {
    console.error("Error in auth-users API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 