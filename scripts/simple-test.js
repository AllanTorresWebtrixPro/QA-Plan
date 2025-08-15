#!/usr/bin/env node

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function simpleTest() {
  console.log("🔍 Simple Database Test\n");

  try {
    // Test 1: Direct database query
    console.log("1️⃣ Testing direct database query...");

    const { data, error } = await supabase
      .from("basecamp_oauth_tokens")
      .select("*")
      .eq("user_id", "default_user")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log("❌ Database error:", error);
    } else {
      console.log("✅ Database query successful");
      console.log("   Found token:", data ? "Yes" : "No");
      if (data) {
        console.log("   Token ID:", data.id);
        console.log("   User ID:", data.user_id);
        console.log(
          "   Access Token:",
          data.access_token?.substring(0, 20) + "..."
        );
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

simpleTest();
