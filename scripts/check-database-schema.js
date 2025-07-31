#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabaseSchema() {
  console.log("🔍 Database Schema Check");
  console.log("=======================\n");

  try {
    // Check if we can list tables
    console.log("📋 Checking table access...");

    // Try to access each table with different queries
    const tables = ["qa_users", "qa_tests", "qa_user_test_progress"];

    for (const table of tables) {
      console.log(`\n🔍 Checking table: ${table}`);

      try {
        // Try a simple select with limit 1
        const { data, error } = await supabase.from(table).select("*").limit(1);

        if (error) {
          console.log(`❌ Error accessing ${table}: ${error.message}`);
          console.log(`   Code: ${error.code}`);
          console.log(`   Details: ${error.details}`);
        } else {
          console.log(`✅ Successfully accessed ${table}`);
          console.log(`   Records found: ${data?.length || 0}`);
        }
      } catch (err) {
        console.log(`❌ Exception accessing ${table}: ${err.message}`);
      }
    }

    // Check RLS policies
    console.log("\n🔒 Checking Row Level Security...");
    try {
      const { data: rlsData, error: rlsError } = await supabase.rpc(
        "get_rls_policies"
      );

      if (rlsError) {
        console.log(`❌ Could not check RLS policies: ${rlsError.message}`);
      } else {
        console.log("✅ RLS policies check completed");
      }
    } catch (err) {
      console.log(`❌ RLS check failed: ${err.message}`);
    }

    // Test with different user context
    console.log("\n👤 Testing with different user context...");
    try {
      const { data: userData, error: userError } = await supabase
        .from("qa_users")
        .select("id, name, email")
        .limit(3);

      if (userError) {
        console.log(`❌ User context test failed: ${userError.message}`);
      } else {
        console.log(
          `✅ User context test successful: ${
            userData?.length || 0
          } users found`
        );
        if (userData && userData.length > 0) {
          console.log("   Sample users:");
          userData.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.email})`);
          });
        }
      }
    } catch (err) {
      console.log(`❌ User context test exception: ${err.message}`);
    }
  } catch (err) {
    console.log(`❌ General error: ${err.message}`);
  }
}

checkDatabaseSchema().catch(console.error);
