#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 Database Connection Test");
console.log("==========================\n");

// Check environment variables
console.log("📋 Environment Variables:");
console.log(`  Supabase URL: ${supabaseUrl ? "✅ Configured" : "❌ Missing"}`);
console.log(`  Supabase Key: ${supabaseKey ? "✅ Configured" : "❌ Missing"}`);

if (!supabaseUrl || !supabaseKey) {
  console.log("\n❌ Environment variables are not properly configured.");
  console.log("Please create a .env.local file with:");
  console.log("  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
  console.log("  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  const startTime = Date.now();
  const results = {
    connection: false,
    tables: {
      user_profiles: { exists: false, count: 0 },
      qa_tests: { exists: false, count: 0 },
      qa_user_test_progress: { exists: false, count: 0 },
    },
    errors: [],
  };

  try {
    console.log("\n🔌 Testing Database Connection...");

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("user_profiles")
      .select("count", { count: "exact", head: true });

    if (connectionError) {
      results.errors.push(`Connection failed: ${connectionError.message}`);
      console.log(`❌ Connection failed: ${connectionError.message}`);
    } else {
      results.connection = true;
      console.log("✅ Database connection successful");
    }

    // Test each table
    console.log("\n📊 Testing Database Tables:");
    const tables = ["user_profiles", "qa_tests", "qa_user_test_progress"];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count", { count: "exact", head: true });

        if (error) {
          results.errors.push(`Table ${table} error: ${error.message}`);
          results.tables[table] = { exists: false, count: 0 };
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          const count = data?.[0]?.count || 0;
          results.tables[table] = { exists: true, count };
          console.log(`✅ Table ${table}: ${count} records`);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        results.errors.push(`Table ${table} failed: ${errorMsg}`);
        results.tables[table] = { exists: false, count: 0 };
        console.log(`❌ Table ${table}: ${errorMsg}`);
      }
    }

    // Test sample data fetch
    console.log("\n📋 Testing Sample Data Fetch...");
    try {
      const { data: users, error: usersError } = await supabase
        .from("user_profiles")
        .select("*")
        .limit(5);

      if (usersError) {
        results.errors.push(`Sample data fetch failed: ${usersError.message}`);
        console.log(`❌ Sample data fetch failed: ${usersError.message}`);
      } else {
        console.log(
          `✅ Sample data fetch successful: ${users?.length || 0} users found`
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      results.errors.push(`Sample data fetch error: ${errorMsg}`);
      console.log(`❌ Sample data fetch error: ${errorMsg}`);
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    results.errors.push(`General error: ${errorMsg}`);
    console.log(`❌ General error: ${errorMsg}`);
  }

  const responseTime = Date.now() - startTime;

  // Summary
  console.log("\n📈 Test Summary:");
  console.log(`  Response Time: ${responseTime}ms`);
  console.log(
    `  Connection: ${results.connection ? "✅ Working" : "❌ Failed"}`
  );
  console.log(
    `  Tables Found: ${
      Object.values(results.tables).filter((t) => t.exists).length
    }/3`
  );
  console.log(`  Errors: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log("\n❌ Errors Found:");
    results.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  if (
    results.connection &&
    Object.values(results.tables).every((t) => t.exists)
  ) {
    console.log("\n🎉 All tests passed! Database is properly configured.");
  } else {
    console.log("\n⚠️  Some tests failed. Please check the errors above.");
    process.exit(1);
  }
}

testDatabaseConnection().catch(console.error);
