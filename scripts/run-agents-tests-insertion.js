#!/usr/bin/env node

/**
 * Run Agents Testing Guide Test Cases Insertion
 *
 * This script executes the SQL script to add all Agents testing scenarios
 * to the qa_tests table in the database.
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function insertAgentsTests() {
  console.log("🚀 Inserting Agents Testing Guide Test Cases\n");

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

    // Define all agent test cases
    let testCases = [
      {
        id: "agt-003",
        title: "Agent Dashboard Metrics Display",
        category: "Agents",
        priority: "High",
        steps: [
          "Navigate to Agents section",
          "View dashboard metrics cards",
          "Check Total Agents count",
          "Verify Total Companies count",
          "Check New Agents This Month",
          "Verify Active Agent Percentage",
        ],
        expected:
          "All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors",
        edge_cases: [
          "Test with zero agents",
          "test with very large numbers",
          "test with decimal calculations",
          "test with data updates",
        ],
      },
      {
        id: "agt-004",
        title: "Agent Dashboard Navigation",
        category: "Agents",
        priority: "High",
        steps: [
          "Click on Agents tab",
          "Click on Companies tab",
          "Verify tab switching works",
          "Check content updates correctly",
          "Test browser back/forward navigation",
        ],
        expected:
          "Tab switching works smoothly, content updates correctly, navigation state maintained, no data loss during navigation",
        edge_cases: [
          "Test with unsaved form data",
          "test with active filters",
          "test with selected table rows",
          "test with browser refresh",
        ],
      },
      {
        id: "agt-005",
        title: "Agent Table Initial Load",
        category: "Agents",
        priority: "High",
        steps: [
          "Load Agents section",
          "Wait for table to populate",
          "Verify all columns are visible",
          "Check table headers are correct",
          "Verify data rows are displayed",
        ],
        expected:
          "Table loads within 3 seconds, all columns visible, headers correct, data rows displayed, no loading errors",
        edge_cases: [
          "Test with slow network connection",
          "test with large datasets",
          "test with empty data",
          "test with browser cache disabled",
        ],
      },
      {
        id: "agt-006",
        title: "Agent Table Column Sorting",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Click on ID column header",
          "Click on Agent Name column header",
          "Click on Company column header",
          "Click on Status column header",
          "Verify sort direction toggles",
        ],
        expected:
          "Clicking headers sorts data correctly, sort direction toggles (asc/desc), sort indicators visible, sort persists during navigation",
        edge_cases: [
          "Test with null values",
          "test with mixed data types",
          "test with special characters",
          "test with very long text",
        ],
      },
      {
        id: "agt-007",
        title: "Agent Table Pagination",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Navigate through different pages",
          "Change items per page",
          "Test page size options",
          "Verify data consistency across pages",
          "Check page numbers update",
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
        id: "agt-008",
        title: "Agent Search Functionality",
        category: "Agents",
        priority: "High",
        steps: [
          "Enter search terms in search box",
          "Test agent name searches",
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
        id: "agt-009",
        title: "Agent Filter by Company",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Filter by specific company (e.g., Acme Inc)",
          "Filter by another company (e.g., Globex Corp)",
          "Test All Companies option",
          "Check filter persistence",
          "Verify table updates",
        ],
        expected:
          "Company filters work correctly, table shows only matching agents, filter selection persists, clear filter option works",
        edge_cases: [
          "Test with no agents in company",
          "test with many companies",
          "test with company names containing special characters",
        ],
      },
      {
        id: "agt-010",
        title: "Agent Filter by Status",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Filter by Active agents",
          "Filter by Inactive agents",
          "Filter by Pending agents",
          "Test multiple status selections",
          "Verify filter counts are accurate",
        ],
        expected:
          "Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate",
        edge_cases: [
          "Test with no agents in status",
          "test with all statuses selected",
          "test with status changes during filtering",
        ],
      },
      {
        id: "agt-011",
        title: "Add New Agent - Form Display",
        category: "Agents",
        priority: "High",
        steps: [
          "Click Add New Agent button",
          "Verify modal opens correctly",
          "Check all required fields are marked",
          "Verify form layout is correct",
          "Test form responsiveness",
        ],
        expected:
          "Modal opens smoothly, all required fields marked with asterisks, form layout is clean, responsive design works",
        edge_cases: [
          "Test with different screen sizes",
          "test with browser zoom levels",
          "test with different font sizes",
          "test with high DPI displays",
        ],
      },
      {
        id: "agt-012",
        title: "Add New Agent - Required Field Validation",
        category: "Agents",
        priority: "High",
        steps: [
          "Leave Agent Name empty",
          "Leave Company empty",
          "Leave Email empty",
          "Leave Phone empty",
          "Submit form",
          "Verify validation errors",
        ],
        expected:
          "Required field validation works, error messages clear, form highlights problematic fields, user can correct errors easily",
        edge_cases: [
          "Test with all required fields missing",
          "test with partial required fields",
          "test with whitespace only",
          "test with very long text",
        ],
      },
      {
        id: "agt-013",
        title: "Add New Agent - Field Format Validation",
        category: "Agents",
        priority: "High",
        steps: [
          "Enter invalid email format",
          "Enter invalid phone format",
          "Enter invalid commission rate",
          "Enter invalid start date",
          "Submit form",
          "Verify format validation",
        ],
        expected:
          "Format validation works correctly, error messages helpful, form prevents submission with invalid data, user guidance clear",
        edge_cases: [
          "Test with various invalid formats",
          "test with edge case data",
          "test with international formats",
          "test with special characters",
        ],
      },
      {
        id: "agt-014",
        title: "Add New Agent - Successful Submission",
        category: "Agents",
        priority: "High",
        steps: [
          "Fill all required fields correctly",
          "Fill optional fields",
          "Upload agent photo",
          "Submit form",
          "Verify agent appears in table",
        ],
        expected:
          "Form submits successfully, new agent appears in table, success message displayed, modal closes automatically",
        edge_cases: [
          "Test with maximum field lengths",
          "test with special characters",
          "test with large photo files",
          "test with concurrent submissions",
        ],
      },
      {
        id: "agt-015",
        title: "Edit Agent - Form Population",
        category: "Agents",
        priority: "High",
        steps: [
          "Click Edit button on existing agent",
          "Verify modal opens with current data",
          "Check all fields populated correctly",
          "Verify photo displays correctly",
          "Test field editing",
        ],
        expected:
          "Edit form opens with current agent data, all fields populated correctly, photo displays properly, form is editable",
        edge_cases: [
          "Test with agents having all fields filled",
          "test with agents missing optional fields",
          "test with agents having special characters",
        ],
      },
      {
        id: "agt-016",
        title: "Edit Agent - Data Updates",
        category: "Agents",
        priority: "High",
        steps: [
          "Modify agent name",
          "Change company assignment",
          "Update email address",
          "Change phone number",
          "Save changes",
          "Verify updates reflected",
        ],
        expected:
          "Changes saved successfully, updated information displays correctly in table, no data corruption occurs, success message shown",
        edge_cases: [
          "Test with concurrent edits",
          "test with invalid data",
          "test with network interruption",
          "test with large text updates",
        ],
      },
      {
        id: "agt-017",
        title: "Delete Agent - Confirmation Dialog",
        category: "Agents",
        priority: "High",
        steps: [
          "Click Delete button on agent",
          "Verify confirmation dialog appears",
          "Check dialog text is clear",
          "Test dialog close button",
          "Verify dialog positioning",
        ],
        expected:
          "Confirmation dialog appears correctly, text is clear and informative, close button works, dialog properly positioned",
        edge_cases: [
          "Test with different screen sizes",
          "test with long agent names",
          "test with special characters in names",
          "test with browser zoom",
        ],
      },
      {
        id: "agt-018",
        title: "Delete Agent - Successful Deletion",
        category: "Agents",
        priority: "High",
        steps: [
          "Confirm agent deletion",
          "Verify agent removed from table",
          "Check metrics update correctly",
          "Verify no errors occur",
          "Test table refresh",
        ],
        expected:
          "Agent permanently deleted, table updates immediately, metrics recalculated, success message displayed, no errors",
        edge_cases: [
          "Test with agents having relationships",
          "test with agents having photos",
          "test with network failure during deletion",
          "test with browser refresh during process",
        ],
      },
      {
        id: "agt-019",
        title: "Agent Photo Upload",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Click Choose File button",
          "Select valid photo file",
          "Verify file name displayed",
          "Check file size validation",
          "Test different file formats",
        ],
        expected:
          "File selection works correctly, file name displayed, size validation works, supported formats accepted, upload successful",
        edge_cases: [
          "Test with very large files",
          "test with unsupported formats",
          "test with corrupted files",
          "test with files having special characters",
        ],
      },
      {
        id: "agt-020",
        title: "Agent Photo Display",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Upload agent photo",
          "Verify photo displays in form",
          "Check photo displays in table",
          "Test photo scaling",
          "Verify photo quality",
        ],
        expected:
          "Photo displays correctly in form and table, proper scaling maintained, quality preserved, no display errors",
        edge_cases: [
          "Test with different photo sizes",
          "test with transparent backgrounds",
          "test with high resolution images",
          "test with animated GIFs",
        ],
      },
      {
        id: "agt-021",
        title: "Agent Name Field Validation",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Enter valid agent name",
          "Test minimum length requirement",
          "Test maximum length limit",
          "Test special characters",
          "Test whitespace handling",
        ],
        expected:
          "Agent name validation works correctly, length limits enforced, special characters handled properly, whitespace trimmed",
        edge_cases: [
          "Test with very long names",
          "test with names containing numbers",
          "test with names in different languages",
          "test with emoji characters",
        ],
      },
      {
        id: "agt-022",
        title: "Company Assignment Field",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Click company dropdown",
          "Verify company list loads",
          "Select different companies",
          "Test search within dropdown",
          "Verify selection persists",
        ],
        expected:
          "Company dropdown works correctly, company list loads, search functionality works, selection persists, no errors",
        edge_cases: [
          "Test with many companies",
          "test with company names containing special characters",
          "test with very long company names",
          "test with concurrent selections",
        ],
      },
      {
        id: "agt-023",
        title: "Agent Status Field",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Click status dropdown",
          "Verify status options load",
          "Select different statuses",
          "Test status validation",
          "Verify status updates",
        ],
        expected:
          "Status dropdown works correctly, status options load, validation works, status updates properly, selection persists",
        edge_cases: [
          "Test with all status options",
          "test with status transitions",
          "test with invalid status combinations",
          "test with concurrent status changes",
        ],
      },
      {
        id: "agt-024",
        title: "Commission Rate Field",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Enter valid commission rate",
          "Test decimal precision",
          "Test percentage format",
          "Test range validation",
          "Verify calculation accuracy",
        ],
        expected:
          "Commission rate validation works correctly, decimal precision maintained, percentage format accepted, range validation works",
        edge_cases: [
          "Test with very high rates",
          "test with zero rates",
          "test with negative rates",
          "test with very long decimal numbers",
        ],
      },
      {
        id: "agt-025",
        title: "Start Date Field",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Click date picker",
          "Select valid start date",
          "Test date format",
          "Test date validation",
          "Verify date persistence",
        ],
        expected:
          "Date picker works correctly, date format consistent, validation works, date persists correctly, no format errors",
        edge_cases: [
          "Test with future dates",
          "test with past dates",
          "test with leap years",
          "test with different date formats",
        ],
      },
      {
        id: "agt-026",
        title: "Agent Row Selection",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Select individual agent rows",
          "Select multiple agent rows",
          "Test select all functionality",
          "Verify selection state",
          "Test selection persistence",
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
        id: "agt-027",
        title: "Agent Table Actions Column",
        category: "Agents",
        priority: "High",
        steps: [
          "Verify view icon is green",
          "Verify edit icon is pencil",
          "Verify delete icon is red trash can",
          "Test icon hover effects",
          "Verify icon accessibility",
        ],
        expected:
          "Action icons display correctly, hover effects work, icons are accessible, color coding is clear, functionality obvious",
        edge_cases: [
          "Test with different screen readers",
          "test with keyboard navigation",
          "test with high contrast mode",
          "test with color blindness simulators",
        ],
      },
      {
        id: "agt-028",
        title: "Agent Desktop Layout (1920x1080)",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Set browser to 1920x1080 resolution",
          "Verify all elements visible",
          "Check table displays full columns",
          "Test horizontal scrolling if needed",
          "Verify form layout",
        ],
        expected:
          "All UI elements fit properly, table shows maximum information, no horizontal scrolling needed, form layout optimized",
        edge_cases: [
          "Test with different desktop resolutions",
          "test with browser zoom levels",
          "test with different font sizes",
          "test with high DPI displays",
        ],
      },
      {
        id: "agt-029",
        title: "Agent Tablet Layout (768x1024)",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Set browser to 768x1024 resolution",
          "Check responsive breakpoints",
          "Verify table adapts to width",
          "Test touch interactions",
          "Verify form responsiveness",
        ],
        expected:
          "Layout adapts to tablet size, touch targets appropriate, table columns stack if needed, form remains usable",
        edge_cases: [
          "Test with different tablet orientations",
          "test with touch gestures",
          "test with virtual keyboard",
          "test with different tablet sizes",
        ],
      },
      {
        id: "agt-030",
        title: "Agent Mobile Layout (375x667)",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Set browser to 375x667 resolution",
          "Verify mobile-optimized layout",
          "Test touch interactions",
          "Check navigation menu",
          "Verify form mobile-friendliness",
        ],
        expected:
          "Layout mobile-friendly, touch targets 44px minimum, navigation menu accessible, form optimized for mobile",
        edge_cases: [
          "Test with different mobile sizes",
          "test with landscape orientation",
          "test with touch gestures",
          "test with virtual keyboard",
        ],
      },
      {
        id: "agt-031",
        title: "Agent Table Performance",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Test with 100+ agents",
          "Test table sorting performance",
          "Test search performance",
          "Test pagination performance",
          "Monitor memory usage",
        ],
        expected:
          "Performance remains acceptable with large datasets, sorting and search respond quickly, pagination smooth, no memory leaks",
        edge_cases: [
          "Test with maximum data limits",
          "test with concurrent operations",
          "test with data updates",
          "test with network delays",
        ],
      },
      {
        id: "agt-032",
        title: "Agent Form Performance",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Test form load time",
          "Test form submission time",
          "Test form validation speed",
          "Test photo upload performance",
          "Monitor form responsiveness",
        ],
        expected:
          "Form loads quickly, submission responsive, validation instant, photo upload efficient, overall form performance good",
        edge_cases: [
          "Test with large photo files",
          "test with complex form data",
          "test with slow network",
          "test with limited memory",
        ],
      },
      {
        id: "agt-033",
        title: "Agent Network Error Handling",
        category: "Agents",
        priority: "High",
        steps: [
          "Disconnect network connection",
          "Attempt to add agent",
          "Attempt to edit agent",
          "Attempt to delete agent",
          "Reconnect network",
          "Verify recovery",
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
        id: "agt-034",
        title: "Agent Form Error Recovery",
        category: "Agents",
        priority: "High",
        steps: [
          "Submit form with errors",
          "Correct validation errors",
          "Resubmit form",
          "Verify successful submission",
          "Check error state cleared",
        ],
        expected:
          "Form error recovery works correctly, validation errors clear after correction, successful submission possible, error state properly managed",
        edge_cases: [
          "Test with multiple validation errors",
          "test with complex error scenarios",
          "test with concurrent error corrections",
          "test with form refresh",
        ],
      },
      {
        id: "agt-035",
        title: "Agent Keyboard Navigation",
        category: "Agents",
        priority: "High",
        steps: [
          "Use Tab key to navigate form",
          "Use Enter/Space to activate buttons",
          "Use arrow keys in table",
          "Test escape key functionality",
          "Verify focus management",
        ],
        expected:
          "All interactive elements reachable, focus indicators visible, keyboard shortcuts work, no keyboard traps, focus management proper",
        edge_cases: [
          "Test with screen reader",
          "test with keyboard-only navigation",
          "test with different keyboard layouts",
          "test with assistive technologies",
        ],
      },
      {
        id: "agt-036",
        title: "Agent Screen Reader Compatibility",
        category: "Agents",
        priority: "High",
        steps: [
          "Enable screen reader software",
          "Navigate through agent form",
          "Verify proper labeling",
          "Check semantic structure",
          "Test table accessibility",
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
        id: "agt-037",
        title: "Agent Chrome Compatibility",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Test all agent features in Chrome",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify table interactions",
        ],
        expected:
          "All agent features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Chrome versions",
          "test with Chrome extensions",
          "test with Chrome DevTools",
          "test with Chrome flags",
        ],
      },
      {
        id: "agt-038",
        title: "Agent Firefox Compatibility",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Test all agent features in Firefox",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify table interactions",
        ],
        expected:
          "All agent features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Firefox versions",
          "test with Firefox add-ons",
          "test with Firefox Developer Tools",
          "test with Firefox preferences",
        ],
      },
      {
        id: "agt-039",
        title: "Agent Safari Compatibility",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Test all agent features in Safari",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify table interactions",
        ],
        expected:
          "All agent features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Safari versions",
          "test with Safari Developer Tools",
          "test with Safari preferences",
          "test with Safari extensions",
        ],
      },
      {
        id: "agt-040",
        title: "Agent Empty State Handling",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Test with no agents data",
          "Test with empty search results",
          "Test with no filter matches",
          "Verify empty state messages",
          "Test empty state actions",
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
        id: "agt-041",
        title: "Agent Large Dataset Handling",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Test with 1000+ agents",
          "Test with complex filters",
          "Test with multiple searches",
          "Monitor performance metrics",
          "Verify data integrity",
        ],
        expected:
          "Performance remains acceptable, UI remains responsive, memory usage stable, data integrity maintained, user experience smooth",
        edge_cases: [
          "Test with maximum data limits",
          "test with concurrent operations",
          "test with data updates",
          "test with export operations",
        ],
      },
      {
        id: "agt-042",
        title: "Agent Commission Calculation",
        category: "Agents",
        priority: "High",
        steps: [
          "Set commission rate for agent",
          "Add sales transactions",
          "Verify commission calculations",
          "Test different rate types",
          "Check calculation accuracy",
        ],
        expected:
          "Commission calculations are accurate, different rate types work correctly, calculations update in real-time, no calculation errors",
        edge_cases: [
          "Test with very high rates",
          "test with zero rates",
          "test with decimal precision",
          "test with currency conversions",
        ],
      },
      {
        id: "agt-043",
        title: "Agent Performance Metrics",
        category: "Agents",
        priority: "Medium",
        steps: [
          "View agent performance dashboard",
          "Check sales metrics",
          "Verify commission totals",
          "Test performance filters",
          "Monitor real-time updates",
        ],
        expected:
          "Performance metrics display correctly, real-time updates work, filters function properly, data accuracy maintained",
        edge_cases: [
          "Test with large datasets",
          "test with concurrent updates",
          "test with network delays",
          "test with data refresh",
        ],
      },
      {
        id: "agt-044",
        title: "Agent-Company Relationship",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Assign agent to company",
          "Change agent company",
          "Verify relationship updates",
          "Test relationship validation",
          "Check data consistency",
        ],
        expected:
          "Agent-company relationships work correctly, updates propagate properly, validation prevents invalid relationships, data remains consistent",
        edge_cases: [
          "Test with orphaned agents",
          "test with company deletions",
          "test with relationship conflicts",
          "test with concurrent updates",
        ],
      },
      {
        id: "agt-045",
        title: "Agent-Client Relationship",
        category: "Agents",
        priority: "Medium",
        steps: [
          "Assign clients to agent",
          "View agent client list",
          "Test client reassignment",
          "Verify relationship tracking",
          "Check data integrity",
        ],
        expected:
          "Agent-client relationships work correctly, assignments track properly, reassignments function, data integrity maintained",
        edge_cases: [
          "Test with many clients",
          "test with client deletions",
          "test with relationship conflicts",
          "test with concurrent assignments",
        ],
      },
    ];

    // Check if tests already exist
    const { data: existingTests, error: checkError } = await supabase
      .from("qa_tests")
      .select("id")
      .eq("category", "Agents")
      .limit(1);

    if (checkError) {
      console.error("❌ Cannot check existing tests:", checkError.message);
      return;
    }

    if (existingTests && existingTests.length > 0) {
      console.log("ℹ️  Agents tests already exist in database");
      console.log("Checking for existing test IDs to avoid duplicates...");

      // Get existing test IDs to avoid conflicts
      const { data: allExistingTests, error: allError } = await supabase
        .from("qa_tests")
        .select("id")
        .eq("category", "Agents");

      if (allError) {
        console.error("❌ Cannot get existing test IDs:", allError.message);
        return;
      }

      const existingIds = allExistingTests.map((t) => t.id);
      console.log(
        `Found ${existingIds.length} existing Agents tests:`,
        existingIds
      );

      // Filter out tests that already exist
      const newTestCases = testCases.filter(
        (test) => !existingIds.includes(test.id)
      );

      if (newTestCases.length === 0) {
        console.log("✅ All Agents tests already exist in database");
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
      `\n📊 Agents insertion completed: ${insertedCount}/${testCases.length} tests inserted`
    );
  } catch (error) {
    console.error("❌ Agents insertion failed:", error.message);
  }
}

// Main execution
async function main() {
  console.log("🔍 Agents Testing Guide Database Insertion");
  console.log("=".repeat(60));

  await insertAgentsTests();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { insertAgentsTests };
