const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need to add this to your .env.local
);

async function migrateUsersToAuth() {
  console.log('Starting user migration to Supabase Auth...');

  try {
    // Step 1: Get all users from qa_users table
    const { data: existingUsers, error: fetchError } = await supabase
      .from('qa_users')
      .select('*');

    if (fetchError) {
      console.error('Error fetching existing users:', fetchError);
      return;
    }

    console.log(`Found ${existingUsers.length} users to migrate`);

    // Step 2: Create users in auth.users
    for (const user of existingUsers) {
      console.log(`Migrating user: ${user.name} (${user.email})`);

      try {
        // Create user in auth.users
        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: 'temporary-password-123', // Users will need to reset this
          email_confirm: true,
          user_metadata: {
            name: user.name,
            avatar: user.avatar
          }
        });

        if (createError) {
          console.error(`Error creating auth user for ${user.email}:`, createError);
          continue;
        }

        // Update qa_user_test_progress to use new user ID
        const { error: updateError } = await supabase
          .from('qa_user_test_progress')
          .update({ user_id: authUser.user.id })
          .eq('user_id', user.id);

        if (updateError) {
          console.error(`Error updating progress for user ${user.email}:`, updateError);
        } else {
          console.log(`✅ Successfully migrated ${user.name}`);
        }

      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
      }
    }

    console.log('Migration completed!');
    console.log('\nNext steps:');
    console.log('1. Run the migration SQL script: scripts/migrate-to-supabase-auth.sql');
    console.log('2. Update foreign key constraints');
    console.log('3. Test the new authentication flow');
    console.log('4. Drop the qa_users table once everything is working');

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateUsersToAuth(); 