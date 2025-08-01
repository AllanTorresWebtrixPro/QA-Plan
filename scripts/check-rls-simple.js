const { createClient } = require('@supabase/supabase-js');

// Use the same environment variables as the app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRLS() {
  try {
    console.log('\n=== Checking RLS Policies ===');
    
    // Try to query the table to see what happens
    console.log('\n1. Testing SELECT query...');
    const { data: selectData, error: selectError } = await supabase
      .from('qa_user_test_progress')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('SELECT Error:', selectError);
    } else {
      console.log('SELECT Success:', selectData?.length || 0, 'rows');
    }

    // Try to insert a test record
    console.log('\n2. Testing INSERT query...');
    const testData = {
      id: 'test-rls-check-' + Date.now(),
      user_id: '70cd5175-251b-42d6-98e1-de4deb26e666',
      test_id: 'acc-002',
      completed: false,
      notes: 'RLS test',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('qa_user_test_progress')
      .insert(testData)
      .select();

    if (insertError) {
      console.log('INSERT Error:', insertError);
    } else {
      console.log('INSERT Success:', insertData);
      
      // Clean up
      await supabase
        .from('qa_user_test_progress')
        .delete()
        .eq('id', testData.id);
    }

    // Check current user context
    console.log('\n3. Checking user context...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('User context error:', userError);
    } else if (user) {
      console.log('Current user:', user.email, '(', user.id, ')');
    } else {
      console.log('No authenticated user');
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

checkRLS(); 