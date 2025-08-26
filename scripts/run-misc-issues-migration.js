#!/usr/bin/env node

/**
 * Script to run the misc issues database migration
 * This script creates the misc_issues table and related structures
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please ensure these are set in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting misc issues database migration...\n');

    // Read the SQL migration file
    const migrationPath = path.join(__dirname, 'add-misc-issues-table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Executing migration SQL...');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    
    // Verify the setup
    console.log('\n🔍 Verifying setup...');
    
    // Check if the table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('misc_issues_with_users')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Verification failed:', tableError);
      process.exit(1);
    }

    console.log('✅ Misc issues table and view created successfully');
    
    // Get count of sample data
    const { count, error: countError } = await supabase
      .from('qa_misc_issues')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting records:', countError);
    } else {
      console.log(`✅ Sample data created: ${count} misc issues`);
    }

    console.log('\n🎉 Misc issues migration completed successfully!');
    console.log('\n📋 What was created:');
    console.log('   - qa_misc_issues table');
    console.log('   - misc_issues_with_users view');
    console.log('   - Sample misc issues data');
    console.log('   - Proper indexes and constraints');
    console.log('\n🔗 You can now access the Misc Issues page at: /misc-issues');

  } catch (error) {
    console.error('❌ Migration failed with error:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
