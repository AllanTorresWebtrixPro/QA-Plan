const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies for qa_user_test_progress...');
    
    // Execute the SQL commands directly
    const commands = [
      // Drop ALL existing policies for qa_user_test_progress to avoid conflicts
      'DROP POLICY IF EXISTS "Only assigned users can modify their own progress" ON qa_user_test_progress;',
      'DROP POLICY IF EXISTS "Users can view all test progress" ON qa_user_test_progress;',
      'DROP POLICY IF EXISTS "Users can insert progress for assigned tests" ON qa_user_test_progress;',
      'DROP POLICY IF EXISTS "Users can update their own progress for assigned tests" ON qa_user_test_progress;',
      'DROP POLICY IF EXISTS "Users can delete their own progress for assigned tests" ON qa_user_test_progress;',
      
      // Create separate policies for different operations
      // Policy for SELECT: Users can view all test progress (for collaboration)
      'CREATE POLICY "Users can view all test progress" ON qa_user_test_progress FOR SELECT USING (auth.role() = \'authenticated\');',
      
      // Policy for INSERT: Users can insert progress for tests they are assigned to
      'CREATE POLICY "Users can insert progress for assigned tests" ON qa_user_test_progress FOR INSERT WITH CHECK (auth.role() = \'authenticated\' AND user_id = auth.uid() AND can_modify_test_progress(test_id, auth.uid()));',
      
      // Policy for UPDATE: Users can update their own progress for tests they are assigned to
      'CREATE POLICY "Users can update their own progress for assigned tests" ON qa_user_test_progress FOR UPDATE USING (auth.role() = \'authenticated\' AND user_id = auth.uid() AND can_modify_test_progress(test_id, auth.uid()));',
      
      // Policy for DELETE: Users can delete their own progress for tests they are assigned to
      'CREATE POLICY "Users can delete their own progress for assigned tests" ON qa_user_test_progress FOR DELETE USING (auth.role() = \'authenticated\' AND user_id = auth.uid() AND can_modify_test_progress(test_id, auth.uid()));'
    ];
    
    for (const command of commands) {
      console.log(`Executing: ${command.substring(0, 50)}...`);
      
      // Use the REST API to execute SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql: command })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Error executing command:', error);
        console.error('Command:', command);
        return;
      }
    }
    
    console.log('✅ RLS policies fixed successfully!');
    console.log('');
    console.log('The following policies have been updated:');
    console.log('- Users can view all test progress (for collaboration)');
    console.log('- Users can insert progress for tests they are assigned to');
    console.log('- Users can update their own progress for assigned tests');
    console.log('- Users can delete their own progress for assigned tests');
    
  } catch (error) {
    console.error('❌ Error fixing RLS policies:', error);
  }
}

// Run the fix
fixRLSPolicies(); 