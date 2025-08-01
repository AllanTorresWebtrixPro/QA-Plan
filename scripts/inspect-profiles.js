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

async function inspectProfiles() {
  try {
    console.log('🔍 Inspecting user profiles...');

    // Get all user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at');

    if (profilesError) {
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('ℹ️  No user profiles found');
      return;
    }

    console.log(`📋 Found ${profiles.length} user profiles:`);
    console.log('');

    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ID: ${profile.id}`);
      console.log(`   Name: ${profile.name || 'NULL'}`);
      console.log(`   Avatar: ${profile.avatar || 'NULL'}`);
      console.log(`   Role: ${profile.role || 'NULL'}`);
      console.log(`   Created: ${profile.created_at}`);
      console.log('');
    });

    // Check for profiles with null names
    const nullNameProfiles = profiles.filter(p => !p.name);
    if (nullNameProfiles.length > 0) {
      console.log(`⚠️  Found ${nullNameProfiles.length} profiles with null names:`);
      nullNameProfiles.forEach(profile => {
        console.log(`   - ${profile.id}`);
      });
    } else {
      console.log('✅ All profiles have names');
    }

  } catch (error) {
    console.error('❌ Error inspecting profiles:', error);
    process.exit(1);
  }
}

// Run the script
inspectProfiles(); 