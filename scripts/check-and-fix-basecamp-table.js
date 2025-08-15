#!/usr/bin/env node

/**
 * Check and Fix Basecamp OAuth Tokens Table
 *
 * This script checks the table schema and adds missing columns.
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAndFixTable() {
  console.log("🔍 Checking Basecamp OAuth Tokens Table Schema\n");

  try {
    // First, let's check if the table exists and get its structure
    console.log("1️⃣ Checking table structure...");

    const { data: tableInfo, error: tableError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", "basecamp_oauth_tokens")
      .eq("table_schema", "public");

    if (tableError) {
      console.error("❌ Error checking table structure:", tableError);
      return;
    }

    console.log("✅ Table structure:");
    tableInfo.forEach((col) => {
      console.log(
        `   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`
      );
    });

    // Check if is_active column exists
    const hasIsActive = tableInfo.some(
      (col) => col.column_name === "is_active"
    );

    if (!hasIsActive) {
      console.log("\n2️⃣ Adding missing 'is_active' column...");

      const { error: alterError } = await supabase.rpc("exec_sql", {
        sql: `
          ALTER TABLE basecamp_oauth_tokens 
          ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
          
          -- Update existing records to be active
          UPDATE basecamp_oauth_tokens 
          SET is_active = TRUE 
          WHERE is_active IS NULL;
        `,
      });

      if (alterError) {
        console.error("❌ Error adding is_active column:", alterError);
        console.log("\n📝 Manual fix required:");
        console.log("Run this SQL in your database:");
        console.log(`
          ALTER TABLE basecamp_oauth_tokens 
          ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
          
          UPDATE basecamp_oauth_tokens 
          SET is_active = TRUE 
          WHERE is_active IS NULL;
        `);
      } else {
        console.log("✅ is_active column added successfully");
      }
    } else {
      console.log("✅ is_active column already exists");
    }

    // Check if other required columns exist
    const requiredColumns = ["token_type", "scope", "created_at", "updated_at"];
    const missingColumns = requiredColumns.filter(
      (col) => !tableInfo.some((tableCol) => tableCol.column_name === col)
    );

    if (missingColumns.length > 0) {
      console.log(`\n3️⃣ Adding missing columns: ${missingColumns.join(", ")}`);

      const alterSql = missingColumns
        .map((col) => {
          switch (col) {
            case "token_type":
              return "ADD COLUMN token_type VARCHAR(50) DEFAULT 'Bearer'";
            case "scope":
              return "ADD COLUMN scope VARCHAR(255)";
            case "created_at":
              return "ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
            case "updated_at":
              return "ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
            default:
              return null;
          }
        })
        .filter(Boolean)
        .join(",\n");

      const { error: alterError } = await supabase.rpc("exec_sql", {
        sql: `ALTER TABLE basecamp_oauth_tokens ${alterSql};`,
      });

      if (alterError) {
        console.error("❌ Error adding missing columns:", alterError);
        console.log("\n📝 Manual fix required:");
        console.log("Run this SQL in your database:");
        console.log(`ALTER TABLE basecamp_oauth_tokens ${alterSql};`);
      } else {
        console.log("✅ Missing columns added successfully");
      }
    } else {
      console.log("✅ All required columns exist");
    }

    // Test the token retrieval
    console.log("\n4️⃣ Testing token retrieval...");

    const {
      getActiveBasecampToken,
    } = require("../services/basecamp-token-service");

    // Test with the user IDs from your table
    const testUserIds = ["8req534easf", "n2n8k7gbs47", "default_user"];

    for (const userId of testUserIds) {
      console.log(`\n   Testing with user_id: ${userId}`);
      const result = await getActiveBasecampToken(userId);

      if (result.success) {
        console.log(`   ✅ Token found for ${userId}`);
        console.log(`   Token ID: ${result.token?.id}`);
      } else {
        console.log(`   ❌ No token found for ${userId}: ${result.error}`);
      }
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

// Run the check
checkAndFixTable();
