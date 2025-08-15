const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createUser(name, email, password = 'password123') {
  console.log(`Creating user: ${name} (${email})`);

  try {
    // Create user in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
      }
    });

    if (authError) {
      console.error(`Error creating auth user: ${authError.message}`);
      return;
    }

    console.log(`✅ Created auth user: ${email}`);
    console.log(`User ID: ${authUser.user.id}`);

    // The user profile will be created automatically by the trigger
    // But let's verify it was created
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single();

    if (profileError) {
      console.log(`⚠️  Profile not found: ${profileError.message}`);
    } else {
      console.log(`✅ Profile created: ${profile.name}`);
    }

    console.log(`\nUser created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User can now sign in at http://localhost:3001`);

  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Example usage
async function createExampleUsers() {
  console.log('Creating example users...\n');
  
  await createUser('Sarah Johnson', 'sarah@company.com');
  console.log('---');
  await createUser('Mike Chen', 'mike@company.com');
  console.log('---');
  await createUser('Lisa Rodriguez', 'lisa@company.com');
}

// If run directly, create example users
if (require.main === module) {
  createExampleUsers().catch(console.error);
}

module.exports = { createUser }; 