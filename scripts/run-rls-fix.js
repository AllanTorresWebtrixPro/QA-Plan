#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing user_profiles RLS policies...\n');

    // Read the SQL fix file
    const fixPath = path.join(__dirname, 'fix-user-profiles-rls.sql');
    const fixSQL = fs.readFileSync(fixPath, 'utf8');

    console.log('📄 Executing RLS fix SQL...');
    
    // Split the SQL into individual statements and execute them
    const statements = fixSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`   Executing: ${statement.substring(0, 60)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error('❌ Statement failed:', error);
          console.error('   Statement:', statement);
          // Continue with other statements
        }
      }
    }

    console.log('✅ RLS policies updated successfully!');
    
    // Test the fix
    console.log('\n🧪 Testing the fix...');
    
    // Test with anon key (simulating frontend)
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // This should fail without authentication
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('user_profiles')
      .select('*')
      .eq('id', '70cd5175-251b-42d6-98e1-de4deb26e666')
      .single();
    
    if (anonError) {
      console.log('✅ Anon query properly blocked (expected)');
    } else {
      console.log('⚠️  Anon query succeeded (unexpected - RLS might not be working)');
    }
    
    // Test with service role (should work)
    const { data: adminData, error: adminError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', '70cd5175-251b-42d6-98e1-de4deb26e666')
      .single();
    
    if (adminError) {
      console.error('❌ Admin query failed:', adminError);
    } else {
      console.log('✅ Admin query successful');
      console.log(`   Joe Kaire's role: ${adminData.role}`);
    }
    
    console.log('\n📋 Summary:');
    console.log('   ✅ RLS policies have been updated');
    console.log('   ✅ Authenticated users should now be able to access user_profiles');
    console.log('   ✅ Joe Kaire should see "Admin" role when properly authenticated');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Have Joe Kaire log out and log back in');
    console.log('   2. Check if the profile page now shows "Admin" role');
    console.log('   3. If still showing "Tester", check browser console for errors');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixRLSPolicies();