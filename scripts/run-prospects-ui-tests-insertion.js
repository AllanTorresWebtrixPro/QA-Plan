#!/usr/bin/env node

/**
 * Run Prospects UI Testing Guide Test Cases Insertion
 *
 * This script executes the SQL script to add all Prospects UI testing scenarios
 * to the qa_tests table in the database.
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function insertProspectsUITests() {
  console.log("🚀 Inserting Prospects UI Testing Guide Test Cases\n");

  try {
    // Check if we can connect to the database
    console.log("1️⃣ Testing database connection...");

    const { data: testData, error: testError } = await supabase
      .from("qa_tests")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("❌ Database connection failed:", testError.message);
      return;
    }

    console.log("✅ Database connection successful");

    // Read the SQL file
    console.log("\n2️⃣ Reading SQL script...");

    const sqlFilePath = path.join(
      __dirname,
      "add-prospects-ui-testing-guide.sql"
    );

    if (!fs.existsSync(sqlFilePath)) {
      console.error("❌ SQL file not found:", sqlFilePath);
      return;
    }

    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");
    console.log("✅ SQL script loaded successfully");

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    console.log("\n3️⃣ Executing SQL statements...");

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (statement.trim().length === 0) continue;

      try {
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);

        const { error } = await supabase.rpc("exec_sql", {
          sql: statement + ";",
        });

        if (error) {
          console.error(`   ❌ Statement ${i + 1} failed:`, error.message);
          errorCount++;
        } else {
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.error(`   ❌ Statement ${i + 1} exception:`, err.message);
        errorCount++;
      }
    }

    // Verify the results
    console.log("\n4️⃣ Verifying results...");

    const { data: prospectsTests, error: verifyError } = await supabase
      .from("qa_tests")
      .select("id, title, category, priority")
      .eq("category", "Prospects")
      .order("id");

    if (verifyError) {
      console.error("❌ Verification failed:", verifyError.message);
    } else {
      console.log(
        `✅ Found ${prospectsTests.length} Prospects tests in database`
      );

      if (prospectsTests.length > 0) {
        console.log("\n📋 Sample test cases:");
        prospectsTests.slice(0, 5).forEach((test) => {
          console.log(`   - ${test.id}: ${test.title} (${test.priority})`);
        });

        if (prospectsTests.length > 5) {
          console.log(`   ... and ${prospectsTests.length - 5} more`);
        }
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 EXECUTION SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    console.log(`📝 Total Prospects tests: ${prospectsTests?.length || 0}`);

    if (errorCount === 0) {
      console.log("\n🎉 All Prospects testing scenarios added successfully!");
      console.log(
        "You can now view and assign these tests in your QA application."
      );
    } else {
      console.log(
        "\n⚠️  Some statements failed. Check the logs above for details."
      );
    }
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    console.error(error.stack);
  }
}

// Alternative method using direct SQL execution if RPC is not available
async function insertProspectsUITestsAlternative() {
  console.log("🔄 Trying alternative insertion method...\n");

  try {
    // Check if tests already exist
    const { data: existingTests, error: checkError } = await supabase
      .from("qa_tests")
      .select("id")
      .eq("category", "Prospects")
      .limit(1);

    if (checkError) {
      console.error("❌ Cannot check existing tests:", checkError.message);
      return;
    }

    // Define all test cases
    let testCases = [
      {
        id: "pro-ui-001",
        title: "Page Initial Load - Prospects Section",
        category: "Prospects",
        priority: "High",
        steps: [
          "Navigate to the Prospects section",
          "Wait for page to fully load",
          "Verify all components are visible",
          "Check for loading spinners or placeholders",
        ],
        expected:
          "Page loads within 3 seconds, all UI elements visible, no broken images or missing icons, no console errors in browser dev tools",
        edge_cases: [
          "Test with slow network connection",
          "test with large datasets",
          "test with browser cache disabled",
        ],
      },
      {
        id: "pro-ui-002",
        title: "Navigation Between Prospects Views",
        category: "Prospects",
        priority: "High",
        steps: [
          "Click on Dashboard tab",
          "Click on All Prospects tab",
          "Click on Reports tab",
          "Use browser back/forward buttons",
        ],
        expected:
          "Smooth transitions between views, URL updates correctly, browser navigation works properly, no data loss during navigation",
        edge_cases: [
          "Test with unsaved form data",
          "test with active filters",
          "test with selected table rows",
        ],
      },
      {
        id: "pro-ui-003",
        title: "Dashboard Metrics Display",
        category: "Prospects",
        priority: "High",
        steps: [
          "View the dashboard metrics cards",
          "Check total prospects count",
          "Verify New This Month calculation",
          "Check conversion rate percentage",
          "Verify active leads count",
        ],
        expected:
          "All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors",
        edge_cases: [
          "Test with zero prospects",
          "test with very large numbers",
          "test with decimal calculations",
        ],
      },
      {
        id: "pro-ui-004",
        title: "Date Range Picker Functionality",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Click on date range picker",
          "Select different date ranges",
          "Choose custom date range",
          "Verify metrics update accordingly",
        ],
        expected:
          "Date picker opens correctly, date selection works smoothly, metrics update based on selected range, custom date input accepts valid dates",
        edge_cases: [
          "Test with invalid dates",
          "test with future dates",
          "test with very old dates",
          "test with leap years",
        ],
      },
      {
        id: "pro-ui-005",
        title: "Add New Prospect Workflow",
        category: "Prospects",
        priority: "High",
        steps: [
          "Click Add New Prospect button",
          "Fill out the prospect form",
          "Test required field validation",
          "Submit the form",
          "Verify prospect appears in the list",
        ],
        expected:
          "Form opens correctly, required fields show validation errors, form submits successfully, new prospect appears in table, success message displayed",
        edge_cases: [
          "Test with duplicate emails",
          "test with missing required fields",
          "test with special characters",
          "test with very long text",
        ],
      },
      {
        id: "pro-ui-006",
        title: "Edit Existing Prospect",
        category: "Prospects",
        priority: "High",
        steps: [
          "Find an existing prospect in the table",
          "Click Edit button",
          "Modify prospect information",
          "Save changes",
          "Verify updates are reflected",
        ],
        expected:
          "Edit form opens with current data, changes saved successfully, updated information displays correctly, no data corruption occurs",
        edge_cases: [
          "Test with concurrent edits",
          "test with invalid data",
          "test with network interruption",
          "test with large text updates",
        ],
      },
      {
        id: "pro-ui-007",
        title: "Delete Prospect with Confirmation",
        category: "Prospects",
        priority: "High",
        steps: [
          "Select a prospect to delete",
          "Click Delete button",
          "Verify confirmation dialog appears",
          "Confirm deletion",
          "Check prospect is removed from list",
        ],
        expected:
          "Confirmation dialog appears, prospect permanently deleted, table updates immediately, success message displayed",
        edge_cases: [
          "Test with multiple prospects selected",
          "test with network failure during deletion",
          "test with browser refresh during process",
        ],
      },
      {
        id: "pro-ui-008",
        title: "Convert Prospect to Client",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Select a qualified prospect",
          "Click Convert to Client button",
          "Fill out conversion form",
          "Complete conversion process",
          "Verify prospect status changes",
        ],
        expected:
          "Conversion dialog opens, required fields validated, conversion completes successfully, prospect status updates to Converted",
        edge_cases: [
          "Test with incomplete prospect data",
          "test with validation errors",
          "test with network timeout",
          "test with duplicate client information",
        ],
      },
      {
        id: "pro-ui-009",
        title: "Text Search Functionality",
        category: "Prospects",
        priority: "High",
        steps: [
          "Enter search terms in search box",
          "Test partial name searches",
          "Test email searches",
          "Test phone number searches",
          "Verify search results accuracy",
        ],
        expected:
          "Search results appear instantly, results match search criteria, no false positives, search highlights matching text",
        edge_cases: [
          "Test with no results",
          "test with special characters",
          "test with very long search terms",
          "test with SQL injection attempts",
        ],
      },
      {
        id: "pro-ui-010",
        title: "Filter by Brand",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Select different brands from filter dropdown",
          "Verify table updates accordingly",
          "Test All Brands option",
          "Check filter persistence",
        ],
        expected:
          "Filter dropdown works correctly, table shows only matching prospects, filter selection persists, clear filter option works",
        edge_cases: [
          "Test with no brands available",
          "test with many brands",
          "test with brand names containing special characters",
          "test with concurrent filter changes",
        ],
      },
      {
        id: "pro-ui-011",
        title: "Filter by Status",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Filter by Active prospects",
          "Filter by Archived prospects",
          "Filter by Converted prospects",
          "Test multiple status selections",
        ],
        expected:
          "Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate",
        edge_cases: [
          "Test with no prospects in status",
          "test with all statuses selected",
          "test with status changes during filtering",
          "test with very large result sets",
        ],
      },
      {
        id: "pro-ui-012",
        title: "Table Column Sorting",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Click on different column headers",
          "Verify ascending/descending order",
          "Test sort persistence",
          "Check sort indicators",
        ],
        expected:
          "Clicking headers sorts data, sort direction toggles correctly, sort indicators visible, sort persists during navigation",
        edge_cases: [
          "Test with null values",
          "test with mixed data types",
          "test with special characters",
          "test with very long text",
        ],
      },
      {
        id: "pro-ui-013",
        title: "Table Pagination Controls",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Navigate through different pages",
          "Change items per page",
          "Test page size options",
          "Verify data consistency",
        ],
        expected:
          "Page navigation works correctly, page size changes work, data remains consistent, page numbers are accurate",
        edge_cases: [
          "Test with very large datasets",
          "test with page size changes",
          "test with concurrent data updates",
          "test with network delays",
        ],
      },
      {
        id: "pro-ui-014",
        title: "Table Row Selection",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Select individual rows",
          "Select multiple rows",
          "Test select all functionality",
          "Verify selection state",
        ],
        expected:
          "Individual row selection works, multiple row selection works, select all toggles correctly, selection state maintained",
        edge_cases: [
          "Test with no rows selected",
          "test with all rows selected",
          "test with selection during sorting",
          "test with selection during filtering",
        ],
      },
      {
        id: "pro-ui-015",
        title: "Desktop Layout (1920x1080)",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Set browser to 1920x1080 resolution",
          "Verify all elements visible",
          "Check table displays full columns",
          "Test horizontal scrolling if needed",
        ],
        expected:
          "All UI elements fit properly, table shows maximum information, no horizontal scrolling needed, layout optimized for desktop",
        edge_cases: [
          "Test with different desktop resolutions",
          "test with browser zoom levels",
          "test with different font sizes",
          "test with high DPI displays",
        ],
      },
      {
        id: "pro-ui-016",
        title: "Tablet Layout (768x1024)",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Set browser to 768x1024 resolution",
          "Check responsive breakpoints",
          "Verify table adapts to width",
          "Test touch interactions",
        ],
        expected:
          "Layout adapts to tablet size, touch targets appropriate, table columns stack if needed, navigation remains accessible",
        edge_cases: [
          "Test with different tablet orientations",
          "test with touch gestures",
          "test with virtual keyboard",
          "test with different tablet sizes",
        ],
      },
      {
        id: "pro-ui-017",
        title: "Mobile Layout (375x667)",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Set browser to 375x667 resolution",
          "Verify mobile-optimized layout",
          "Test touch interactions",
          "Check navigation menu",
        ],
        expected:
          "Layout mobile-friendly, touch targets 44px minimum, navigation menu accessible, table adapts to mobile view",
        edge_cases: [
          "Test with different mobile sizes",
          "test with landscape orientation",
          "test with touch gestures",
          "test with virtual keyboard",
        ],
      },
      {
        id: "pro-ui-018",
        title: "Keyboard Navigation",
        category: "Prospects",
        priority: "High",
        steps: [
          "Use Tab key to navigate",
          "Use Enter/Space to activate buttons",
          "Use arrow keys in tables",
          "Test escape key functionality",
        ],
        expected:
          "All interactive elements reachable, focus indicators visible, keyboard shortcuts work, no keyboard traps",
        edge_cases: [
          "Test with screen reader",
          "test with keyboard-only navigation",
          "test with different keyboard layouts",
          "test with assistive technologies",
        ],
      },
      {
        id: "pro-ui-019",
        title: "Screen Reader Compatibility",
        category: "Prospects",
        priority: "High",
        steps: [
          "Enable screen reader software",
          "Navigate through interface",
          "Verify proper labeling",
          "Check semantic structure",
        ],
        expected:
          "Screen reader announces elements correctly, form labels properly associated, table structure semantic, navigation logical",
        edge_cases: [
          "Test with different screen readers",
          "test with different languages",
          "test with complex data",
          "test with dynamic content",
        ],
      },
      {
        id: "pro-ui-020",
        title: "Color Contrast Validation",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Check text contrast ratios",
          "Verify button contrast",
          "Test link contrast",
          "Validate error message contrast",
        ],
        expected:
          "Text meets WCAG AA standards, buttons sufficient contrast, links distinguishable, error messages readable",
        edge_cases: [
          "Test with color blindness simulators",
          "test with high contrast mode",
          "test with different color schemes",
          "test with low vision users",
        ],
      },
      {
        id: "pro-ui-021",
        title: "Page Load Performance",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Measure initial page load time",
          "Test with different data volumes",
          "Monitor memory usage",
          "Check for memory leaks",
        ],
        expected:
          "Page loads within 3 seconds, performance scales with data, no memory leaks detected, smooth scrolling performance",
        edge_cases: [
          "Test with very large datasets",
          "test with slow network",
          "test with limited memory",
          "test with concurrent users",
        ],
      },
      {
        id: "pro-ui-022",
        title: "Search Performance",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Test search with small datasets",
          "Test search with large datasets",
          "Measure search response time",
          "Verify search accuracy",
        ],
        expected:
          "Search responds within 500ms, performance scales with data size, search results accurate, no performance degradation",
        edge_cases: [
          "Test with complex search queries",
          "test with real-time search",
          "test with search suggestions",
          "test with search history",
        ],
      },
      {
        id: "pro-ui-023",
        title: "Network Error Handling",
        category: "Prospects",
        priority: "High",
        steps: [
          "Disconnect network connection",
          "Attempt to perform actions",
          "Reconnect network",
          "Verify recovery behavior",
        ],
        expected:
          "Error messages displayed, retry options available, application recovers gracefully, user informed of issues",
        edge_cases: [
          "Test with intermittent connectivity",
          "test with slow network",
          "test with timeout scenarios",
          "test with server errors",
        ],
      },
      {
        id: "pro-ui-024",
        title: "Form Validation Errors",
        category: "Prospects",
        priority: "High",
        steps: [
          "Submit forms with invalid data",
          "Test required field validation",
          "Test format validation",
          "Verify error message clarity",
        ],
        expected:
          "Validation errors clear, error messages helpful, form highlights problematic fields, user can correct errors easily",
        edge_cases: [
          "Test with all validation rules",
          "test with edge case data",
          "test with concurrent validation",
          "test with accessibility requirements",
        ],
      },
      {
        id: "pro-ui-025",
        title: "Chrome Browser Compatibility",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Test all features in Chrome",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
        ],
        expected:
          "All features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Chrome versions",
          "test with Chrome extensions",
          "test with Chrome DevTools",
          "test with Chrome flags",
        ],
      },
      {
        id: "pro-ui-026",
        title: "Firefox Browser Compatibility",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Test all features in Firefox",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
        ],
        expected:
          "All features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Firefox versions",
          "test with Firefox add-ons",
          "test with Firefox Developer Tools",
          "test with Firefox preferences",
        ],
      },
      {
        id: "pro-ui-027",
        title: "Safari Browser Compatibility",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Test all features in Safari",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
        ],
        expected:
          "All features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Safari versions",
          "test with Safari Developer Tools",
          "test with Safari preferences",
          "test with Safari extensions",
        ],
      },
      {
        id: "pro-ui-028",
        title: "Empty State Handling",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Test with no prospects data",
          "Test with empty search results",
          "Test with no filter matches",
          "Verify empty state messages",
        ],
        expected:
          "Empty states display appropriate messages, no errors occur, user can still navigate, clear actions available",
        edge_cases: [
          "Test with loading states",
          "test with error states",
          "test with partial data",
          "test with data refresh",
        ],
      },
      {
        id: "pro-ui-029",
        title: "Large Dataset Performance",
        category: "Prospects",
        priority: "Medium",
        steps: [
          "Test with 1000+ prospects",
          "Test with complex filters",
          "Test with multiple searches",
          "Monitor performance metrics",
        ],
        expected:
          "Performance remains acceptable, UI remains responsive, memory usage stable, user experience smooth",
        edge_cases: [
          "Test with maximum data limits",
          "test with concurrent operations",
          "test with data updates",
          "test with export operations",
        ],
      },
      {
        id: "pro-ui-030",
        title: "Concurrent User Testing",
        category: "Prospects",
        priority: "Low",
        steps: [
          "Test with multiple users accessing",
          "Test with simultaneous edits",
          "Test with concurrent searches",
          "Verify data consistency",
        ],
        expected:
          "Data remains consistent, conflicts handled gracefully, performance acceptable, user experience maintained",
        edge_cases: [
          "Test with user permissions",
          "test with data locking",
          "test with conflict resolution",
          "test with audit trails",
        ],
      },
    ];

    if (existingTests && existingTests.length > 0) {
      console.log("ℹ️  Prospects tests already exist in database");
      console.log("Checking for existing test IDs to avoid duplicates...");

      // Get existing test IDs to avoid conflicts
      const { data: allExistingTests, error: allError } = await supabase
        .from("qa_tests")
        .select("id")
        .eq("category", "Prospects");

      if (allError) {
        console.error("❌ Cannot get existing test IDs:", allError.message);
        return;
      }

      const existingIds = allExistingTests.map((t) => t.id);
      console.log(
        `Found ${existingIds.length} existing Prospects tests:`,
        existingIds
      );

      // Filter out tests that already exist
      const newTestCases = testCases.filter(
        (test) => !existingIds.includes(test.id)
      );

      if (newTestCases.length === 0) {
        console.log("✅ All Prospects UI tests already exist in database");
        return;
      }

      console.log(`📝 Will insert ${newTestCases.length} new test cases`);
      // Update the testCases array to only include new tests
      testCases = newTestCases;
    }

    // Insert test cases one by one
    console.log("📝 Inserting test cases individually...");

    let insertedCount = 0;

    for (const testCase of testCases) {
      try {
        const { error } = await supabase.from("qa_tests").insert(testCase);

        if (error) {
          console.error(`❌ Failed to insert ${testCase.id}:`, error.message);
        } else {
          console.log(`✅ Inserted ${testCase.id}: ${testCase.title}`);
          insertedCount++;
        }
      } catch (err) {
        console.error(`❌ Exception inserting ${testCase.id}:`, err.message);
      }
    }

    console.log(
      `\n📊 Alternative insertion completed: ${insertedCount}/${testCases.length} tests inserted`
    );
  } catch (error) {
    console.error("❌ Alternative method failed:", error.message);
  }
}

// Main execution
async function main() {
  console.log("🔍 Prospects UI Testing Guide Database Insertion");
  console.log("=".repeat(60));

  // Try the main method first
  // await insertProspectsUITests();

  // If that fails, try the alternative method
  await insertProspectsUITestsAlternative();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { insertProspectsUITests, insertProspectsUITestsAlternative };
