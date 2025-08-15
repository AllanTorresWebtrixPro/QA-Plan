const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function disableRLSTemp() {
  try {
    console.log('🔧 Temporarily disabling RLS on qa_user_test_progress...');
    
    // Execute the SQL command to disable RLS
    const { error } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE qa_user_test_progress DISABLE ROW LEVEL SECURITY;' 
    });
    
    if (error) {
      console.error('❌ Error disabling RLS:', error);
      return;
    }
    
    console.log('✅ RLS temporarily disabled on qa_user_test_progress!');
    console.log('');
    console.log('⚠️  WARNING: This is temporary for development.');
    console.log('   Remember to re-enable RLS with proper policies later.');
    console.log('');
    console.log('Now users should be able to report issues without RLS restrictions.');
    
  } catch (error) {
    console.error('❌ Error disabling RLS:', error);
  }
}

// Run the disable
disableRLSTemp(); 