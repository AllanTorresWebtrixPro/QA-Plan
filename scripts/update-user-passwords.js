const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateUserPasswords() {
  console.log('Updating user passwords...');

  try {
    // Get all users from auth.users
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return;
    }

    console.log(`Found ${users.users.length} users to update`);

    // Update each user's password
    for (const user of users.users) {
      console.log(`Updating password for: ${user.email}`);

      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          {
            password: 'password123'
          }
        );

        if (updateError) {
          console.error(`Error updating password for ${user.email}:`, updateError);
        } else {
          console.log(`✅ Successfully updated password for ${user.email}`);
        }

      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
      }
    }

    console.log('\nPassword update completed!');
    console.log('\nUsers can now sign in with:');
    console.log('- Email: allan@company.com, joe@company.com, or assaf@company.com');
    console.log('- Password: password123');

  } catch (error) {
    console.error('Password update failed:', error);
  }
}

// Run the password update
updateUserPasswords(); 