#!/usr/bin/env node

/**
 * Run Basecamp OAuth Tokens Table Migration
 *
 * This script creates the basecamp_oauth_tokens table in your database.
 * Make sure your database connection is properly configured.
 */

const fs = require("fs");
const path = require("path");

async function runMigration() {
  console.log("🚀 Running Basecamp OAuth Tokens Migration\n");

  try {
    // Read the migration SQL file
    const migrationPath = path.join(
      __dirname,
      "create-basecamp-tokens-table.sql"
    );
    const sqlContent = fs.readFileSync(migrationPath, "utf8");

    console.log("📋 Migration SQL:");
    console.log("=".repeat(50));
    console.log(sqlContent);
    console.log("=".repeat(50));
    console.log("\n");

    console.log("✅ Migration SQL file loaded successfully");
    console.log("\n📝 To apply this migration:");
    console.log("1. Connect to your database (Supabase, PostgreSQL, etc.)");
    console.log("2. Run the SQL commands above");
    console.log("3. Or use your database management tool to execute the SQL");
    console.log("\n🔗 For Supabase:");
    console.log("- Go to your Supabase dashboard");
    console.log("- Navigate to SQL Editor");
    console.log("- Paste and execute the SQL commands");
    console.log(
      "\n⚠️  Make sure to backup your database before running migrations!"
    );
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
