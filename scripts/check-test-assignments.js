const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTestAssignments() {
  try {
    console.log('🔍 Checking test_assignments view...\n');

    // Check test_assignments view
    const { data: assignments, error: assignmentsError } = await supabase
      .from('test_assignments')
      .select('test_id, title, category')
      .limit(10);

    if (assignmentsError) {
      console.error('Error fetching test_assignments:', assignmentsError);
      return;
    }

    console.log('📋 test_assignments view (first 10):');
    assignments.forEach(assignment => {
      console.log(`  - ${assignment.test_id}: ${assignment.title} (${assignment.category})`);
    });

    console.log('\n🔍 Checking qa_tests table...\n');

    // Check qa_tests table
    const { data: qaTests, error: qaTestsError } = await supabase
      .from('qa_tests')
      .select('id, title, category')
      .limit(10);

    if (qaTestsError) {
      console.error('Error fetching qa_tests:', qaTestsError);
      return;
    }

    console.log('📋 qa_tests table (first 10):');
    qaTests.forEach(test => {
      console.log(`  - ${test.id}: ${test.title} (${test.category})`);
    });

    // Check if acc-002 exists in either
    console.log('\n🔍 Checking for acc-002 specifically...\n');

    const { data: acc002Assignment, error: acc002AssignmentError } = await supabase
      .from('test_assignments')
      .select('*')
      .eq('test_id', 'acc-002')
      .single();

    const { data: acc002QaTest, error: acc002QaTestError } = await supabase
      .from('qa_tests')
      .select('*')
      .eq('id', 'acc-002')
      .single();

    console.log('acc-002 in test_assignments:', acc002Assignment ? '✅ Found' : '❌ Not found');
    console.log('acc-002 in qa_tests:', acc002QaTest ? '✅ Found' : '❌ Not found');

  } catch (error) {
    console.error('Error:', error);
  }
}

checkTestAssignments(); 