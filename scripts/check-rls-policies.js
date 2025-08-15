const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSPolicies() {
  try {
    console.log('Checking RLS policies on qa_user_test_progress table...\n');

    // Check if RLS is enabled
    const { data: rlsEnabled, error: rlsError } = await supabase
      .from('information_schema.tables')
      .select('row_security')
      .eq('table_name', 'qa_user_test_progress')
      .eq('table_schema', 'public')
      .single();

    if (rlsError) {
      console.error('Error checking RLS status:', rlsError);
      return;
    }

    console.log(`RLS enabled: ${rlsEnabled.row_security}`);

    // Get RLS policies
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.policies')
      .select('*')
      .eq('table_name', 'qa_user_test_progress')
      .eq('table_schema', 'public');

    if (policiesError) {
      console.error('Error fetching policies:', policiesError);
      return;
    }

    console.log('\nRLS Policies:');
    if (policies.length === 0) {
      console.log('No RLS policies found');
    } else {
      policies.forEach((policy, index) => {
        console.log(`\n${index + 1}. Policy: ${policy.policy_name}`);
        console.log(`   Action: ${policy.action}`);
        console.log(`   Roles: ${policy.roles}`);
        console.log(`   Command: ${policy.command}`);
        console.log(`   Definition: ${policy.definition}`);
      });
    }

    // Test current user context
    console.log('\nTesting current user context...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('No authenticated user in service context');
    } else {
      console.log(`Current user: ${user.email} (${user.id})`);
    }

    // Test if we can insert with service role
    console.log('\nTesting insert with service role...');
    const testData = {
      id: 'test-rls-check',
      user_id: '70cd5175-251b-42d6-98e1-de4deb26e666',
      test_id: 'acc-002',
      completed: false,
      notes: 'RLS test',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('qa_user_test_progress')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('Insert failed:', insertError);
    } else {
      console.log('Insert successful:', insertResult);
      
      // Clean up test data
      await supabase
        .from('qa_user_test_progress')
        .delete()
        .eq('id', 'test-rls-check');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkRLSPolicies(); 