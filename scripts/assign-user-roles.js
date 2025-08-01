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

async function assignUserRoles() {
  try {
    console.log('🔄 Starting user role assignment...');

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

    console.log(`📋 Found ${profiles.length} user profiles`);

    // Assign roles
    const updates = [];
    
    // Set the first user as admin, others as tester
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      const role = i === 0 ? 'admin' : 'tester';
      
      // Only update if the profile has a valid name
      if (profile.name) {
        updates.push({
          id: profile.id,
          role: role
        });
      } else {
        console.log(`   ⚠️  Skipping profile ${profile.id} (missing name)`);
      }
    }

    // Update each profile individually to avoid upsert issues
    const updatedProfiles = [];
    
    for (const update of updates) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .update({ role: update.role })
          .eq('id', update.id)
          .select('id, name, role')
          .single();

        if (error) {
          console.log(`   ❌ Failed to update ${update.id}: ${error.message}`);
        } else {
          updatedProfiles.push(data);
          console.log(`   ✅ ${data.name} (${data.id.slice(0, 8)}...) → ${data.role.toUpperCase()}`);
        }
      } catch (error) {
        console.log(`   ❌ Error updating ${update.id}: ${error.message}`);
      }
    }

    // Summary
    const adminCount = updatedProfiles.filter(p => p.role === 'admin').length;
    const testerCount = updatedProfiles.filter(p => p.role === 'tester').length;
    
    console.log('\n📊 Role Assignment Summary:');
    console.log(`   👑 Admins: ${adminCount}`);
    console.log(`   🧪 Testers: ${testerCount}`);
    console.log(`   📈 Total: ${updatedProfiles.length}`);

  } catch (error) {
    console.error('❌ Error assigning user roles:', error);
    process.exit(1);
  }
}

// Run the script
assignUserRoles(); 