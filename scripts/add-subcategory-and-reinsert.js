const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addSubcategoryColumn() {
  console.log('🔧 Adding subcategory column to qa_tests table...');
  
  const alterTableSQL = `
    ALTER TABLE qa_tests ADD COLUMN IF NOT EXISTS subcategory TEXT;
    CREATE INDEX IF NOT EXISTS idx_qa_tests_subcategory ON qa_tests(subcategory);
    CREATE INDEX IF NOT EXISTS idx_qa_tests_category_subcategory ON qa_tests(category, subcategory);
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: alterTableSQL });
    if (error) {
      console.log('Column addition error (might already exist):', error.message);
    } else {
      console.log('✅ Subcategory column added successfully');
    }
  } catch (err) {
    console.log('Column might already exist, continuing...');
  }
}

async function deleteExistingSettingsTests() {
  console.log('🗑️  Deleting existing Settings test cases...');
  
  try {
    const { error } = await supabase
      .from('qa_tests')
      .delete()
      .eq('category', 'Settings');

    if (error) {
      console.log('Error deleting existing tests:', error.message);
    } else {
      console.log('✅ Existing Settings tests deleted');
    }
  } catch (err) {
    console.log('Error during deletion:', err.message);
  }
}

async function insertTestCasesFromFile(filePath) {
  console.log(`📝 Processing ${path.basename(filePath)}...`);
  
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Find the INSERT statement and extract all VALUES
    const insertMatch = sqlContent.match(/INSERT INTO test_cases.*?VALUES\s*([\s\S]*?);/);
    if (!insertMatch) {
      console.log('⚠️  No INSERT statement found in file');
      return 0;
    }

    const valuesSection = insertMatch[1];
    
    // Split by VALUES and extract each value set
    const valueSets = valuesSection
      .split(/\),\s*\(/)
      .map(set => set.trim())
      .filter(set => set.length > 0)
      .map(set => {
        // Remove leading and trailing parentheses
        if (set.startsWith('(')) set = set.substring(1);
        if (set.endsWith(')')) set = set.substring(0, set.length - 1);
        return set;
      });

    console.log(`Found ${valueSets.length} value sets`);

    let successCount = 0;
    for (const valueSet of valueSets) {
      try {
        const values = parseValues(valueSet);
        
        if (values) {
          // Convert to qa_tests table format with subcategory
          const { error } = await supabase
            .from('qa_tests')
            .insert({
              id: generateTestId(values.category, values.subcategory),
              title: values.title,
              category: values.category,
              subcategory: values.subcategory,
              priority: values.priority,
              steps: values.steps,
              expected: values.expected,
              edge_cases: values.edge_cases,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.log(`⚠️  Error inserting test case: ${error.message}`);
          } else {
            successCount++;
          }
        }
      } catch (err) {
        console.log(`⚠️  Error processing value set: ${err.message}`);
      }
    }

    console.log(`✅ Successfully inserted ${successCount} test cases from ${path.basename(filePath)}`);
    return successCount;
  } catch (err) {
    console.log(`❌ Error reading file ${filePath}: ${err.message}`);
    return 0;
  }
}

function generateTestId(category, subcategory) {
  const categoryPrefix = category === 'Settings' ? 'SETTINGS' : category.toUpperCase().substring(0, 3);
  const subcategoryPrefix = subcategory ? subcategory.replace(/\s+/g, '').substring(0, 3).toUpperCase() : 'GEN';
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryPrefix}-${subcategoryPrefix}-${randomSuffix}`;
}

function parseValues(valuesStr) {
  try {
    // Remove the outer quotes and split by comma, but be careful with nested quotes
    const parts = [];
    let current = '';
    let inQuotes = false;
    let inArray = false;
    let bracketCount = 0;

    for (let i = 0; i < valuesStr.length; i++) {
      const char = valuesStr[i];
      
      if (char === "'" && (i === 0 || valuesStr[i-1] !== '\\')) {
        inQuotes = !inQuotes;
        if (!inQuotes && !inArray) {
          parts.push(current.trim());
          current = '';
        }
      } else if (char === '[' && !inQuotes) {
        inArray = true;
        bracketCount++;
        current += char;
      } else if (char === ']' && !inQuotes) {
        bracketCount--;
        current += char;
        if (bracketCount === 0) {
          inArray = false;
          parts.push(current.trim());
          current = '';
        }
      } else if (char === ',' && !inQuotes && !inArray) {
        // Skip this comma, we already handled it
      } else {
        current += char;
      }
    }

    if (parts.length >= 6) {
      return {
        title: parts[0].replace(/^'|'$/g, ''),
        category: parts[1].replace(/^'|'$/g, ''),
        subcategory: parts[2].replace(/^'|'$/g, ''),
        priority: parts[3].replace(/^'|'$/g, ''),
        steps: JSON.parse(parts[4]),
        expected: parts[5].replace(/^'|'$/g, ''),
        edge_cases: parts[6] ? JSON.parse(parts[6]) : null
      };
    }
  } catch (err) {
    console.log('Error parsing values:', err.message);
  }
  return null;
}

async function runMigration() {
  console.log('🚀 Starting subcategory migration and Settings test re-insertion...');

  try {
    // Step 1: Add subcategory column
    await addSubcategoryColumn();

    // Step 2: Delete existing Settings tests
    await deleteExistingSettingsTests();

    // Step 3: Get all Settings test files
    const scriptsDir = path.join(__dirname);
    const settingsFiles = fs.readdirSync(scriptsDir)
      .filter(file => file.startsWith('add-settings-') && file.endsWith('-tests.sql'))
      .sort();

    console.log(`📁 Found ${settingsFiles.length} Settings test files`);

    // Step 4: Re-insert all Settings tests with subcategory data
    let totalInserted = 0;
    for (const file of settingsFiles) {
      const filePath = path.join(scriptsDir, file);
      const inserted = await insertTestCasesFromFile(filePath);
      totalInserted += inserted;
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Total test cases re-inserted: ${totalInserted}`);

    // Step 5: Verify the insertion
    const { data: testCases, error } = await supabase
      .from('qa_tests')
      .select('*')
      .eq('category', 'Settings');

    if (error) {
      console.log('Error verifying test cases:', error.message);
    } else {
      console.log(`✅ Verified ${testCases.length} Settings test cases in qa_tests table`);
      
      // Show sample with subcategory
      if (testCases.length > 0) {
        console.log('\n📋 Sample test cases with subcategory:');
        testCases.slice(0, 3).forEach(test => {
          console.log(`- ${test.id}: ${test.title} (${test.subcategory})`);
        });
      }
    }

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
runMigration().catch(console.error);
