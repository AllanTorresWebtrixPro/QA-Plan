const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUserProfiles() {
  try {
    console.log('🔄 Starting user profile fix...');

    // Get all user profiles with null names
    const { data: profilesWithNullNames, error: nullNamesError } = await supabase
      .from('user_profiles')
      .select('*')
      .is('name', null);

    if (nullNamesError) {
      throw nullNamesError;
    }

    if (!profilesWithNullNames || profilesWithNullNames.length === 0) {
      console.log('✅ No user profiles with null names found');
      return;
    }

    console.log(`📋 Found ${profilesWithNullNames.length} user profiles with null names`);

    // Fix each profile
    for (const profile of profilesWithNullNames) {
      try {
        // Get user data from auth.users
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id);
        
        if (authError) {
          console.log(`   ⚠️  Could not fetch auth user for ${profile.id}: ${authError.message}`);
          continue;
        }

        // Generate a name from email if no name in metadata
        const name = authUser.user.user_metadata?.name || 
                    authUser.user.email?.split('@')[0] || 
                    'Unknown User';
        
        const avatar = authUser.user.user_metadata?.avatar || 
                      name.split(' ').map(n => n[0]).join('').toUpperCase();

        // Update the profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            name: name,
            avatar: avatar
          })
          .eq('id', profile.id);

        if (updateError) {
          console.log(`   ❌ Failed to update profile ${profile.id}: ${updateError.message}`);
        } else {
          console.log(`   ✅ Fixed profile ${profile.id}: ${name}`);
        }

      } catch (error) {
        console.log(`   ❌ Error fixing profile ${profile.id}: ${error.message}`);
      }
    }

    console.log('\n✅ User profile fix completed!');

  } catch (error) {
    console.error('❌ Error fixing user profiles:', error);
    process.exit(1);
  }
}

// Run the script
fixUserProfiles(); 