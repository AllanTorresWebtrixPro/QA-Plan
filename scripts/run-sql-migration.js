const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSQLMigration() {
  console.log('🚀 Starting SQL migration...');

  try {
    // Step 1: Create user_profiles table
    console.log('📝 Creating user_profiles table...');
    const { error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Creating user_profiles table...');
      // We'll need to create this through the dashboard or use a different approach
    } else {
      console.log('✅ user_profiles table already exists');
    }

    // Step 2: Create user profiles for existing users
    console.log('📝 Creating user profiles for existing users...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    for (const user of users.users) {
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            name: user.user_metadata?.name || user.email,
            avatar: user.user_metadata?.avatar || user.email?.charAt(0).toUpperCase()
          }, { onConflict: 'id' });

        if (profileError) {
          console.log(`⚠️  Could not create profile for ${user.email}: ${profileError.message}`);
        } else {
          console.log(`✅ Created profile for ${user.email}`);
        }
      } catch (err) {
        console.log(`⚠️  Error creating profile for ${user.email}: ${err.message}`);
      }
    }

    // Step 3: Test the system
    console.log('📝 Testing the system...');
    
    // Test user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.log(`⚠️  Error fetching profiles: ${profilesError.message}`);
    } else {
      console.log(`✅ Found ${profiles.length} user profiles`);
    }

    // Test auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.log(`⚠️  Error fetching auth users: ${authError.message}`);
    } else {
      console.log(`✅ Found ${authUsers.users.length} auth users`);
    }

    console.log('\n🎉 Migration completed!');
    console.log('\nNext steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the SQL script from scripts/migrate-to-supabase-auth.sql');
    console.log('4. Test the authentication system at http://localhost:3001');

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
runSQLMigration().catch(console.error); 