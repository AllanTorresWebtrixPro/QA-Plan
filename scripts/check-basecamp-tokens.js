const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBasecampTokens() {
  try {
    console.log('Checking Basecamp tokens...\n');

    // Get all tokens
    const { data: tokens, error } = await supabase
      .from('basecamp_oauth_tokens')
      .select('*');

    if (error) {
      console.error('Error fetching tokens:', error);
      return;
    }

    if (!tokens || tokens.length === 0) {
      console.log('No Basecamp tokens found in the database.');
      return;
    }

    console.log(`Found ${tokens.length} Basecamp token(s):\n`);

    for (const token of tokens) {
      console.log(`User ID: ${token.user_id}`);
      console.log(`Access Token: ${token.access_token ? 'Present' : 'Missing'}`);
      console.log(`Refresh Token: ${token.refresh_token ? 'Present' : 'Missing'}`);
      console.log(`Expires At: ${token.expires_at}`);
      console.log(`Created At: ${token.created_at}`);
      console.log('---');
    }

    // Also check user profiles
    console.log('\nChecking user profiles...\n');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profileError) {
      console.error('Error fetching profiles:', error);
      return;
    }

    if (profiles && profiles.length > 0) {
      console.log(`Found ${profiles.length} user profile(s):\n`);
      for (const profile of profiles) {
        console.log(`ID: ${profile.id}`);
        console.log(`Name: ${profile.name}`);
        console.log(`Email: ${profile.email}`);
        console.log('---');
      }
    } else {
      console.log('No user profiles found.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkBasecampTokens(); 