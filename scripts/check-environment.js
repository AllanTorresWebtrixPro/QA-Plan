#!/usr/bin/env node

/**
 * Check Environment Variables and Database Connection
 *
 * This script helps identify why the application can't find the basecamp_oauth_tokens table.
 */

require("dotenv").config();

console.log("🔍 Checking Environment Variables and Database Connection\n");

// Check environment variables
console.log("1️⃣ Environment Variables:");
console.log(
  `   NEXT_PUBLIC_SUPABASE_URL: ${
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not Set"
  }`
);
console.log(
  `   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not Set"
  }`
);

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log(
    `   Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
  );
}

// Test database connection
console.log("\n2️⃣ Testing Database Connection...");

const { createClient } = require("@supabase/supabase-js");

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.log("❌ Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    // Test 1: Check if we can connect to the database
    console.log("   Testing basic connection...");

    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .limit(5);

    if (tablesError) {
      console.log(
        "   ❌ Cannot access information_schema:",
        tablesError.message
      );

      // Try a different approach - list tables using RPC
      console.log("   Trying alternative approach...");

      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "get_tables"
      );

      if (rpcError) {
        console.log("   ❌ RPC also failed:", rpcError.message);
      } else {
        console.log("   ✅ RPC successful:", rpcResult);
      }
    } else {
      console.log("   ✅ Can access information_schema");
      console.log("   Tables found:", tables?.length || 0);
      if (tables && tables.length > 0) {
        console.log(
          "   Sample tables:",
          tables
            .slice(0, 3)
            .map((t) => t.table_name)
            .join(", ")
        );
      }
    }

    // Test 2: Try to access the basecamp_oauth_tokens table directly
    console.log("\n   Testing basecamp_oauth_tokens table access...");

    const { data: tokenData, error: tokenError } = await supabase
      .from("basecamp_oauth_tokens")
      .select("id, user_id")
      .limit(1);

    if (tokenError) {
      console.log(
        "   ❌ Cannot access basecamp_oauth_tokens table:",
        tokenError.message
      );

      // Check if it's a permissions issue
      if (tokenError.code === "42501") {
        console.log("   💡 This appears to be a permissions issue");
        console.log("   💡 The table exists but your user doesn't have access");
      } else if (tokenError.code === "42P01") {
        console.log("   💡 The table doesn't exist in this database");
        console.log("   💡 You might be connected to a different database");
      }
    } else {
      console.log("   ✅ Can access basecamp_oauth_tokens table");
      console.log("   Records found:", tokenData?.length || 0);
      if (tokenData && tokenData.length > 0) {
        console.log("   Sample record:", tokenData[0]);
      }
    }
  } catch (error) {
    console.error("   ❌ Connection test failed:", error.message);
  }
}

testConnection();
