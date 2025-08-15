const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUserProfiles() {
  console.log('🔍 Checking user profiles...');

  try {
    // Check user_profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.log('❌ Error fetching user_profiles:', profilesError.message);
    } else {
      console.log('✅ user_profiles table:');
      if (profiles && profiles.length > 0) {
        profiles.forEach(profile => {
          console.log(`  - ${profile.id}: ${profile.name} (${profile.email})`);
        });
      } else {
        console.log('  No user profiles found');
      }
    }

    // Check qa_users table
    const { data: qaUsers, error: qaUsersError } = await supabase
      .from('qa_users')
      .select('*');

    if (qaUsersError) {
      console.log('❌ Error fetching qa_users:', qaUsersError.message);
    } else {
      console.log('✅ qa_users table:');
      if (qaUsers && qaUsers.length > 0) {
        qaUsers.forEach(user => {
          console.log(`  - ${user.id}: ${user.name} (${user.email})`);
        });
      } else {
        console.log('  No qa_users found');
      }
    }

    // Check auth users (if possible)
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.log('❌ Error fetching auth users:', authError.message);
      } else {
        console.log('✅ Auth users:');
        authUsers.users.forEach(user => {
          console.log(`  - ${user.id}: ${user.user_metadata?.name || user.email}`);
        });
      }
    } catch (authErr) {
      console.log('⚠️  Cannot access auth users (admin privileges required)');
    }

  } catch (error) {
    console.error('❌ Error checking user profiles:', error);
  }
}

// Run the script
checkUserProfiles().catch(console.error); 