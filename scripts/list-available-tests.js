const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAvailableTests() {
  console.log('🔍 Listing available tests...');

  try {
    // Check qa_tests table
    const { data: qaTests, error: qaError } = await supabase
      .from('qa_tests')
      .select('id, title, category')
      .limit(10);

    if (qaError) {
      console.log('❌ Error fetching from qa_tests:', qaError.message);
    } else {
      console.log('✅ qa_tests table:');
      qaTests?.forEach(test => {
        console.log(`  - ${test.id}: ${test.title} (${test.category})`);
      });
    }

    // Check test_assignments table
    const { data: assignments, error: assignmentsError } = await supabase
      .from('test_assignments')
      .select('test_id, title, category')
      .limit(10);

    if (assignmentsError) {
      console.log('❌ Error fetching from test_assignments:', assignmentsError.message);
    } else {
      console.log('✅ test_assignments table:');
      assignments?.forEach(test => {
        console.log(`  - ${test.test_id}: ${test.title} (${test.category})`);
      });
    }

    console.log('\n🎯 Use one of these test IDs for testing the add-note functionality');

  } catch (error) {
    console.error('❌ Error listing tests:', error);
  }
}

// Run the script
listAvailableTests().catch(console.error); 