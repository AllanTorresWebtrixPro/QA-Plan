const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkActualData() {
  console.log('🔍 Checking actual data in database...\n');

  try {
    // Check user_profiles
    console.log('📋 Checking user_profiles table:');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.log(`❌ Error: ${profilesError.message}`);
    } else {
      console.log(`✅ Found ${profiles.length} user profiles:`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.name} (${profile.id})`);
      });
    }

    console.log('\n📋 Checking qa_tests table:');
    const { data: tests, error: testsError } = await supabase
      .from('qa_tests')
      .select('*');

    if (testsError) {
      console.log(`❌ Error: ${testsError.message}`);
    } else {
      console.log(`✅ Found ${tests.length} test cases:`);
      tests.slice(0, 5).forEach(test => {
        console.log(`   - ${test.title} (${test.category})`);
      });
      if (tests.length > 5) {
        console.log(`   ... and ${tests.length - 5} more`);
      }
    }

    console.log('\n📋 Checking qa_user_test_progress table:');
    const { data: progress, error: progressError } = await supabase
      .from('qa_user_test_progress')
      .select('*');

    if (progressError) {
      console.log(`❌ Error: ${progressError.message}`);
    } else {
      console.log(`✅ Found ${progress.length} progress records`);
    }

    console.log('\n📋 Checking auth.users:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log(`❌ Error: ${authError.message}`);
    } else {
      console.log(`✅ Found ${authUsers.users.length} auth users:`);
      authUsers.users.forEach(user => {
        console.log(`   - ${user.email} (${user.id})`);
      });
    }

  } catch (error) {
    console.error('Error checking data:', error);
  }
}

checkActualData().catch(console.error); 