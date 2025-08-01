const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixUserIds() {
  console.log('🔧 Fixing user IDs in qa_user_test_progress...');

  try {
    // Step 1: Get all auth users with their metadata
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log(`Found ${users.users.length} auth users`);

    // Create a mapping from old text IDs to new UUIDs
    const userMapping = {};
    for (const user of users.users) {
      const oldId = user.user_metadata?.old_id || user.email?.split('@')[0];
      if (oldId) {
        userMapping[oldId] = user.id;
        console.log(`Mapping: ${oldId} -> ${user.id}`);
      }
    }

    // Step 2: Get all progress records
    const { data: progress, error: progressError } = await supabase
      .from('qa_user_test_progress')
      .select('*');

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return;
    }

    console.log(`Found ${progress.length} progress records`);

    // Step 3: Update each progress record
    for (const record of progress) {
      const oldUserId = record.user_id;
      const newUserId = userMapping[oldUserId];

      if (newUserId) {
        console.log(`Updating progress record ${record.id}: ${oldUserId} -> ${newUserId}`);
        
        const { error: updateError } = await supabase
          .from('qa_user_test_progress')
          .update({ user_id: newUserId })
          .eq('id', record.id);

        if (updateError) {
          console.error(`Error updating record ${record.id}:`, updateError);
        } else {
          console.log(`✅ Updated record ${record.id}`);
        }
      } else {
        console.log(`⚠️  No mapping found for user_id: ${oldUserId}`);
      }
    }

    console.log('\n🎉 User ID fix completed!');
    console.log('\nNext steps:');
    console.log('1. Run the corrected SQL migration script');
    console.log('2. Test the authentication system');

  } catch (error) {
    console.error('Fix failed:', error);
  }
}

// Run the fix
fixUserIds().catch(console.error); 