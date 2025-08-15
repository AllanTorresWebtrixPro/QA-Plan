const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncUserProfiles() {
  try {
    console.log('🔄 Starting user profile sync...\n');

    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    console.log(`Found ${authUsers.users.length} auth users\n`);

    // Get existing user profiles
    const { data: existingProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, name, email');

    if (profileError) {
      console.error('Error fetching existing profiles:', profileError);
      return;
    }

    const existingProfileIds = new Set(existingProfiles.map(p => p.id));
    console.log(`Found ${existingProfiles.length} existing profiles\n`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const authUser of authUsers.users) {
      const userId = authUser.id;
      const userEmail = authUser.email;
      const userName = authUser.user_metadata?.name || userEmail?.split('@')[0] || 'Unknown User';

      console.log(`Processing user: ${userName} (${userEmail})`);

      if (existingProfileIds.has(userId)) {
        console.log(`  ✅ Profile already exists`);
        continue;
      }

      // Create new profile
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          name: userName,
          email: userEmail,
          avatar: userName.charAt(0).toUpperCase(),
          role: 'tester',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error(`  ❌ Error creating profile for ${userName}:`, insertError);
      } else {
        console.log(`  ✅ Created profile for ${userName}`);
        createdCount++;
      }
    }

    console.log(`\n📊 Sync Summary:`);
    console.log(`  - Total auth users: ${authUsers.users.length}`);
    console.log(`  - Existing profiles: ${existingProfiles.length}`);
    console.log(`  - New profiles created: ${createdCount}`);
    console.log(`  - Profiles updated: ${updatedCount}`);

  } catch (error) {
    console.error('Error in syncUserProfiles:', error);
  }
}

syncUserProfiles(); 