const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runComprehensiveMigration() {
  try {
    console.log('🔄 Starting comprehensive migration (roles + test assignment)...');

    // Read the SQL migration file
    const sqlFilePath = path.join(__dirname, 'migrate-all.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 SQL migration file loaded');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🔧 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`   📝 Statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // Some statements might fail if they already exist, which is okay
            if (error.message.includes('already exists') || error.message.includes('duplicate')) {
              console.log(`   ⚠️  Statement ${i + 1} skipped (already exists)`);
            } else {
              console.error(`   ❌ Statement ${i + 1} failed:`, error.message);
            }
          } else {
            console.log(`   ✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`   ❌ Statement ${i + 1} failed:`, err.message);
        }
      }
    }

    console.log('\n✅ Comprehensive migration completed!');
    console.log('\n📋 What was added:');
    console.log('   👑 User Roles: admin/tester roles with proper permissions');
    console.log('   📋 Test Assignment: assign/unassign tests with permission checks');
    console.log('   🔒 RLS Policies: secure access control for all operations');
    console.log('   📊 Views: optimized queries for test assignments');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run add:roles (to assign roles to existing users)');
    console.log('   2. Test the assignment functionality in the UI');
    console.log('   3. Verify that users can assign/unassign tests');
    console.log('   4. Check that only assigned users can modify test progress');

  } catch (error) {
    console.error('❌ Error during comprehensive migration:', error);
    process.exit(1);
  }
}

// Run the migration
runComprehensiveMigration(); 