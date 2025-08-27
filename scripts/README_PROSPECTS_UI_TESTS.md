# Prospects UI Testing Guide - Database Integration

This directory contains scripts to add the comprehensive Prospects UI testing guide scenarios to your QA database.

## Files Created

### 1. `add-prospects-ui-testing-guide.sql`

- **Purpose**: SQL script containing all 30 Prospects UI test scenarios
- **Content**: Complete test cases with steps, expected results, and edge cases
- **Categories**: Page Loading, Navigation, Dashboard Metrics, Prospect Management, Search & Filter, Table Interactions, Responsive Design, Accessibility, Performance, Error Handling, Cross-Browser Compatibility, and Edge Cases

### 2. `run-prospects-ui-tests-insertion.js`

- **Purpose**: Node.js script to execute the SQL insertion
- **Features**: Database connection testing, SQL execution, verification, and error handling
- **Fallback**: Alternative insertion method if RPC is not available

## How to Add Tests to Database

### Method 1: Run the Node.js Script (Recommended)

```bash
# Navigate to the scripts directory
cd scripts

# Install dependencies if not already installed
npm install @supabase/supabase-js dotenv

# Run the insertion script
node run-prospects-ui-tests-insertion.js
```

### Method 2: Execute SQL Directly

If you prefer to run the SQL directly in your database:

```bash
# Copy the SQL content from add-prospects-ui-testing-guide.sql
# Execute it in your Supabase SQL editor or database client
```

### Method 3: Use Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db reset --db-url your_database_url
# Then run the SQL script
```

## Test Categories Added

The script adds **30 comprehensive test cases** covering:

| Category                      | Test Count | Priority    |
| ----------------------------- | ---------- | ----------- |
| **Page Loading & Navigation** | 2          | High        |
| **Dashboard Metrics**         | 2          | High/Medium |
| **Prospect Management**       | 4          | High/Medium |
| **Search & Filter**           | 3          | High/Medium |
| **Table Interactions**        | 3          | Medium      |
| **Responsive Design**         | 3          | Medium      |
| **Accessibility**             | 3          | High/Medium |
| **Performance**               | 2          | Medium      |
| **Error Handling**            | 2          | High        |
| **Cross-Browser**             | 3          | Medium      |
| **Edge Cases**                | 3          | Medium/Low  |

## Test Structure

Each test case includes:

```json
{
  "id": "pro-ui-001",
  "title": "Page Initial Load - Prospects Section",
  "category": "Prospects UI",
  "priority": "High",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "expected": "Expected result description",
  "edge_cases": ["Edge case 1", "Edge case 2"]
}
```

## Database Schema Requirements

The script requires these tables to exist:

- `qa_tests` - Main test definitions table
- Proper indexes for performance
- RLS policies for access control

## Verification

After running the script, you can verify the insertion:

```sql
-- Check how many Prospects UI tests were added
SELECT COUNT(*) FROM qa_tests WHERE category = 'Prospects UI';

-- View all Prospects UI test cases
SELECT id, title, priority FROM qa_tests
WHERE category = 'Prospects UI'
ORDER BY id;

-- Check test distribution by priority
SELECT priority, COUNT(*)
FROM qa_tests
WHERE category = 'Prospects UI'
GROUP BY priority;
```

## Integration with QA Application

Once added to the database, these tests will:

1. **Appear in your QA dashboard** under the "Prospects UI" category
2. **Be available for assignment** to QA testers
3. **Track progress** through the `qa_user_test_progress` table
4. **Support filtering and search** by category, priority, and other criteria

## Customization

You can modify the test cases by:

1. **Editing the SQL file** before execution
2. **Updating existing tests** in the database
3. **Adding new test cases** following the same structure
4. **Modifying priorities** based on your testing needs

## Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check your environment variables
   - Verify Supabase URL and API keys
   - Ensure network connectivity

2. **SQL Execution Errors**

   - Check if the `qa_tests` table exists
   - Verify table schema matches expectations
   - Check RLS policies and permissions

3. **Partial Insertion**
   - Some tests may fail due to constraints
   - Check error logs for specific failures
   - Run the alternative insertion method

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for admin operations)
```

## Next Steps

After successfully adding the tests:

1. **Review the test cases** in your QA application
2. **Assign tests** to appropriate QA team members
3. **Execute the tests** following the detailed steps
4. **Track progress** and results
5. **Update test cases** based on findings

## Support

If you encounter issues:

1. Check the console output for error messages
2. Verify database connectivity and permissions
3. Review the SQL script for syntax errors
4. Contact your development team for assistance

---

**Note**: These test cases are designed to complement your existing automated test suite and provide comprehensive manual testing coverage for the Prospects section UI.
