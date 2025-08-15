const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
          // Convert to qa_tests table format
          const { error } = await supabase
            .from('qa_tests')
            .insert({
              id: generateTestId(values.category, values.subcategory),
              title: values.title,
              category: values.category,
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

async function runSettingsTests() {
  console.log('🚀 Starting Settings test cases insertion into qa_tests table...');

  try {
    // Get all Settings test files
    const scriptsDir = path.join(__dirname);
    const settingsFiles = fs.readdirSync(scriptsDir)
      .filter(file => file.startsWith('add-settings-') && file.endsWith('-tests.sql'))
      .sort();

    console.log(`📁 Found ${settingsFiles.length} Settings test files`);

    let totalInserted = 0;
    for (const file of settingsFiles) {
      const filePath = path.join(scriptsDir, file);
      const inserted = await insertTestCasesFromFile(filePath);
      totalInserted += inserted;
    }

    console.log(`\n🎉 Settings test cases insertion completed!`);
    console.log(`📊 Total test cases inserted: ${totalInserted}`);

    // Verify the insertion
    const { data: testCases, error } = await supabase
      .from('qa_tests')
      .select('*')
      .eq('category', 'Settings');

    if (error) {
      console.log('Error verifying test cases:', error.message);
    } else {
      console.log(`✅ Verified ${testCases.length} Settings test cases in qa_tests table`);
    }

  } catch (error) {
    console.error('Settings test insertion failed:', error);
  }
}

// Run the script
runSettingsTests().catch(console.error);
