#!/usr/bin/env node

/**
 * Run Company Testing Guide Test Cases Insertion
 *
 * This script executes the SQL script to add all Company testing scenarios
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

async function insertCompanyTests() {
  console.log("🚀 Inserting Company Testing Guide Test Cases\n");

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

    const sqlFilePath = path.join(__dirname, "add-company-testing-guide.sql");

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

    const { data: companyTests, error: verifyError } = await supabase
      .from("qa_tests")
      .select("id, title, category, priority")
      .eq("category", "Company")
      .order("id");

    if (verifyError) {
      console.error("❌ Verification failed:", verifyError.message);
    } else {
      console.log(`✅ Found ${companyTests.length} Company tests in database`);

      if (companyTests.length > 0) {
        console.log("\n📋 Sample test cases:");
        companyTests.slice(0, 5).forEach((test) => {
          console.log(`   - ${test.id}: ${test.title} (${test.priority})`);
        });

        if (companyTests.length > 5) {
          console.log(`   ... and ${companyTests.length - 5} more`);
        }
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 EXECUTION SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    console.log(`📝 Total Company tests: ${companyTests?.length || 0}`);

    if (errorCount === 0) {
      console.log("\n🎉 All Company testing scenarios added successfully!");
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

// Alternative method using direct insertion if RPC is not available
async function insertCompanyTestsAlternative() {
  console.log("🔄 Trying alternative insertion method...\n");

  try {
    // Define all company test cases
    const testCases = [
      {
        id: "com-001",
        title: "Company Dashboard Metrics Display",
        category: "Company",
        priority: "High",
        steps: [
          "Navigate to Company section",
          "View dashboard metrics cards",
          "Check Total Companies count",
          "Verify Total Agents count",
          "Check New Agents This Month",
          "Verify Active Agent Percentage",
        ],
        expected:
          "All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors",
        edge_cases: [
          "Test with zero companies",
          "test with very large numbers",
          "test with decimal calculations",
          "test with data updates",
        ],
      },
      {
        id: "com-002",
        title: "Company Dashboard Navigation",
        category: "Company",
        priority: "High",
        steps: [
          "Click on Companies tab",
          "Click on Agents tab",
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
        id: "com-003",
        title: "Company Table Initial Load",
        category: "Company",
        priority: "High",
        steps: [
          "Load Company section",
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
        id: "com-004",
        title: "Company Table Column Sorting",
        category: "Company",
        priority: "Medium",
        steps: [
          "Click on ID column header",
          "Click on Company Name column header",
          "Click on Country column header",
          "Click on City column header",
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
        id: "com-005",
        title: "Company Table Pagination",
        category: "Company",
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
        id: "com-006",
        title: "Company Search Functionality",
        category: "Company",
        priority: "High",
        steps: [
          "Enter search terms in search box",
          "Test company name searches",
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
        id: "com-007",
        title: "Company Filter by Country",
        category: "Company",
        priority: "Medium",
        steps: [
          "Filter by specific country (e.g., AR)",
          "Filter by another country (e.g., UK)",
          "Test All Countries option",
          "Check filter persistence",
          "Verify table updates",
        ],
        expected:
          "Country filters work correctly, table shows only matching companies, filter selection persists, clear filter option works",
        edge_cases: [
          "Test with no companies in country",
          "test with many countries",
          "test with country names containing special characters",
        ],
      },
      {
        id: "com-008",
        title: "Company Filter by Status",
        category: "Company",
        priority: "Medium",
        steps: [
          "Filter by Active companies",
          "Filter by Inactive companies",
          "Test multiple status selections",
          "Verify filter counts are accurate",
          "Check filter combination logic",
        ],
        expected:
          "Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate",
        edge_cases: [
          "Test with no companies in status",
          "test with all statuses selected",
          "test with status changes during filtering",
        ],
      },
      {
        id: "com-009",
        title: "Add New Company - Form Display",
        category: "Company",
        priority: "High",
        steps: [
          "Click Add New Company button",
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
        id: "com-010",
        title: "Add New Company - Required Field Validation",
        category: "Company",
        priority: "High",
        steps: [
          "Leave Company Name empty",
          "Leave Country empty",
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
        id: "com-011",
        title: "Add New Company - Field Format Validation",
        category: "Company",
        priority: "High",
        steps: [
          "Enter invalid email format",
          "Enter invalid phone format",
          "Enter invalid website URL",
          "Enter invalid zip code",
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
        id: "com-012",
        title: "Add New Company - Successful Submission",
        category: "Company",
        priority: "High",
        steps: [
          "Fill all required fields correctly",
          "Fill optional fields",
          "Upload company logo",
          "Submit form",
          "Verify company appears in table",
        ],
        expected:
          "Form submits successfully, new company appears in table, success message displayed, modal closes automatically",
        edge_cases: [
          "Test with maximum field lengths",
          "test with special characters",
          "test with large logo files",
          "test with concurrent submissions",
        ],
      },
      {
        id: "com-013",
        title: "Edit Company - Form Population",
        category: "Company",
        priority: "High",
        steps: [
          "Click Edit button on existing company",
          "Verify modal opens with current data",
          "Check all fields populated correctly",
          "Verify logo displays correctly",
          "Test field editing",
        ],
        expected:
          "Edit form opens with current company data, all fields populated correctly, logo displays properly, form is editable",
        edge_cases: [
          "Test with companies having all fields filled",
          "test with companies missing optional fields",
          "test with companies having special characters",
        ],
      },
      {
        id: "com-014",
        title: "Edit Company - Data Updates",
        category: "Company",
        priority: "High",
        steps: [
          "Modify company name",
          "Change country selection",
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
        id: "com-015",
        title: "Delete Company - Confirmation Dialog",
        category: "Company",
        priority: "High",
        steps: [
          "Click Delete button on company",
          "Verify confirmation dialog appears",
          "Check dialog text is clear",
          "Test dialog close button",
          "Verify dialog positioning",
        ],
        expected:
          "Confirmation dialog appears correctly, text is clear and informative, close button works, dialog properly positioned",
        edge_cases: [
          "Test with different screen sizes",
          "test with long company names",
          "test with special characters in names",
          "test with browser zoom",
        ],
      },
      {
        id: "com-016",
        title: "Delete Company - Successful Deletion",
        category: "Company",
        priority: "High",
        steps: [
          "Confirm company deletion",
          "Verify company removed from table",
          "Check metrics update correctly",
          "Verify no errors occur",
          "Test table refresh",
        ],
        expected:
          "Company permanently deleted, table updates immediately, metrics recalculated, success message displayed, no errors",
        edge_cases: [
          "Test with companies having relationships",
          "test with companies having logos",
          "test with network failure during deletion",
          "test with browser refresh during process",
        ],
      },
      {
        id: "com-017",
        title: "Company Logo Upload",
        category: "Company",
        priority: "Medium",
        steps: [
          "Click Choose File button",
          "Select valid logo file",
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
        id: "com-018",
        title: "Company Logo Display",
        category: "Company",
        priority: "Medium",
        steps: [
          "Upload company logo",
          "Verify logo displays in form",
          "Check logo displays in table",
          "Test logo scaling",
          "Verify logo quality",
        ],
        expected:
          "Logo displays correctly in form and table, proper scaling maintained, quality preserved, no display errors",
        edge_cases: [
          "Test with different logo sizes",
          "test with transparent backgrounds",
          "test with high resolution images",
          "test with animated GIFs",
        ],
      },
      {
        id: "com-019",
        title: "Company Name Field Validation",
        category: "Company",
        priority: "Medium",
        steps: [
          "Enter valid company name",
          "Test minimum length requirement",
          "Test maximum length limit",
          "Test special characters",
          "Test whitespace handling",
        ],
        expected:
          "Company name validation works correctly, length limits enforced, special characters handled properly, whitespace trimmed",
        edge_cases: [
          "Test with very long names",
          "test with names containing numbers",
          "test with names in different languages",
          "test with emoji characters",
        ],
      },
      {
        id: "com-020",
        title: "Country Selection Field",
        category: "Company",
        priority: "Medium",
        steps: [
          "Click country dropdown",
          "Verify country list loads",
          "Select different countries",
          "Test search within dropdown",
          "Verify selection persists",
        ],
        expected:
          "Country dropdown works correctly, country list loads, search functionality works, selection persists, no errors",
        edge_cases: [
          "Test with many countries",
          "test with country names containing special characters",
          "test with very long country names",
          "test with concurrent selections",
        ],
      },
      {
        id: "com-021",
        title: "State Selection Field",
        category: "Company",
        priority: "Medium",
        steps: [
          "Select a country",
          "Verify state dropdown updates",
          "Select different states",
          "Test state-country relationship",
          "Verify state selection",
        ],
        expected:
          "State dropdown updates based on country, state selection works, relationship logic correct, selection persists",
        edge_cases: [
          "Test with countries having many states",
          "test with countries having no states",
          "test with state names containing special characters",
        ],
      },
      {
        id: "com-022",
        title: "Email Field Validation",
        category: "Company",
        priority: "High",
        steps: [
          "Enter valid email format",
          "Test invalid email formats",
          "Test email length limits",
          "Test special characters",
          "Verify email uniqueness",
        ],
        expected:
          "Email validation works correctly, invalid formats rejected, length limits enforced, special characters handled, uniqueness checked",
        edge_cases: [
          "Test with very long emails",
          "test with international domains",
          "test with subdomains",
          "test with email containing numbers",
        ],
      },
      {
        id: "com-023",
        title: "Phone Field Validation",
        category: "Company",
        priority: "High",
        steps: [
          "Enter valid phone format",
          "Test invalid phone formats",
          "Test international formats",
          "Test phone length limits",
          "Verify phone uniqueness",
        ],
        expected:
          "Phone validation works correctly, invalid formats rejected, international formats accepted, length limits enforced, uniqueness checked",
        edge_cases: [
          "Test with very long phone numbers",
          "test with different country codes",
          "test with extensions",
          "test with special characters",
        ],
      },
      {
        id: "com-024",
        title: "Website Field Validation",
        category: "Company",
        priority: "Medium",
        steps: [
          "Enter valid website URL",
          "Test invalid URL formats",
          "Test URL length limits",
          "Test protocol handling",
          "Verify URL accessibility",
        ],
        expected:
          "Website validation works correctly, invalid URLs rejected, length limits enforced, protocol handling correct, accessibility verified",
        edge_cases: [
          "Test with very long URLs",
          "test with different protocols (http, https, ftp)",
          "test with subdomains",
          "test with query parameters",
        ],
      },
      {
        id: "com-025",
        title: "Company Row Selection",
        category: "Company",
        priority: "Medium",
        steps: [
          "Select individual company rows",
          "Select multiple company rows",
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
        id: "com-026",
        title: "Company Table Actions Column",
        category: "Company",
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
        id: "com-027",
        title: "Company Desktop Layout (1920x1080)",
        category: "Company",
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
        id: "com-028",
        title: "Company Tablet Layout (768x1024)",
        category: "Company",
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
        id: "com-029",
        title: "Company Mobile Layout (375x667)",
        category: "Company",
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
        id: "com-030",
        title: "Company Table Performance",
        category: "Company",
        priority: "Medium",
        steps: [
          "Test with 100+ companies",
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
        id: "com-031",
        title: "Company Form Performance",
        category: "Company",
        priority: "Medium",
        steps: [
          "Test form load time",
          "Test form submission time",
          "Test form validation speed",
          "Test file upload performance",
          "Monitor form responsiveness",
        ],
        expected:
          "Form loads quickly, submission responsive, validation instant, file upload efficient, overall form performance good",
        edge_cases: [
          "Test with large logo files",
          "test with complex form data",
          "test with slow network",
          "test with limited memory",
        ],
      },
      {
        id: "com-032",
        title: "Company Network Error Handling",
        category: "Company",
        priority: "High",
        steps: [
          "Disconnect network connection",
          "Attempt to add company",
          "Attempt to edit company",
          "Attempt to delete company",
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
        id: "com-033",
        title: "Company Form Error Recovery",
        category: "Company",
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
        id: "com-034",
        title: "Company Keyboard Navigation",
        category: "Company",
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
        id: "com-035",
        title: "Company Screen Reader Compatibility",
        category: "Company",
        priority: "High",
        steps: [
          "Enable screen reader software",
          "Navigate through company form",
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
        id: "com-036",
        title: "Company Chrome Compatibility",
        category: "Company",
        priority: "Medium",
        steps: [
          "Test all company features in Chrome",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify table interactions",
        ],
        expected:
          "All company features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Chrome versions",
          "test with Chrome extensions",
          "test with Chrome DevTools",
          "test with Chrome flags",
        ],
      },
      {
        id: "com-037",
        title: "Company Firefox Compatibility",
        category: "Company",
        priority: "Medium",
        steps: [
          "Test all company features in Firefox",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify table interactions",
        ],
        expected:
          "All company features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Firefox versions",
          "test with Firefox add-ons",
          "test with Firefox Developer Tools",
          "test with Firefox preferences",
        ],
      },
      {
        id: "com-038",
        title: "Company Safari Compatibility",
        category: "Company",
        priority: "Medium",
        steps: [
          "Test all company features in Safari",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify table interactions",
        ],
        expected:
          "All company features work correctly, JavaScript executes properly, CSS renders as expected, forms submit successfully",
        edge_cases: [
          "Test with different Safari versions",
          "test with Safari Developer Tools",
          "test with Safari preferences",
          "test with Safari extensions",
        ],
      },
      {
        id: "com-039",
        title: "Company Empty State Handling",
        category: "Company",
        priority: "Medium",
        steps: [
          "Test with no companies data",
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
        id: "com-040",
        title: "Company Large Dataset Handling",
        category: "Company",
        priority: "Medium",
        steps: [
          "Test with 1000+ companies",
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
    ];

    // Check if tests already exist
    const { data: existingTests, error: checkError } = await supabase
      .from("qa_tests")
      .select("id")
      .eq("category", "Company")
      .limit(1);

    if (checkError) {
      console.error("❌ Cannot check existing tests:", checkError.message);
      return;
    }

    if (existingTests && existingTests.length > 0) {
      console.log("ℹ️  Company tests already exist in database");
      console.log("Checking for existing test IDs to avoid duplicates...");

      // Get existing test IDs to avoid conflicts
      const { data: allExistingTests, error: allError } = await supabase
        .from("qa_tests")
        .select("id")
        .eq("category", "Company");

      if (allError) {
        console.error("❌ Cannot get existing test IDs:", allError.message);
        return;
      }

      const existingIds = allExistingTests.map((t) => t.id);
      console.log(
        `Found ${existingIds.length} existing Company tests:`,
        existingIds
      );

      // Filter out tests that already exist
      const newTestCases = testCases.filter(
        (test) => !existingIds.includes(test.id)
      );

      if (newTestCases.length === 0) {
        console.log("✅ All Company tests already exist in database");
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
  console.log("🔍 Company Testing Guide Database Insertion");
  console.log("=".repeat(60));

  // Try the main method first
  // await insertCompanyTests();

  // If that fails, try the alternative method
  await insertCompanyTestsAlternative();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { insertCompanyTests, insertCompanyTestsAlternative };
