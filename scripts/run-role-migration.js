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

async function runRoleMigration() {
  try {
    console.log('🔄 Starting role migration...');

    // Read the SQL migration file
    const sqlFilePath = path.join(__dirname, 'add-user-roles.sql');
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

    console.log('\n✅ Role migration completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run add:roles');
    console.log('   2. Test the application with different user roles');

  } catch (error) {
    console.error('❌ Error during role migration:', error);
    process.exit(1);
  }
}

// Run the migration
runRoleMigration(); 