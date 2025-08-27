#!/usr/bin/env node

/**
 * Run Payments Testing Guide Test Cases Insertion
 *
 * This script executes the SQL script to add all Payments testing scenarios
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

async function insertPaymentsTests() {
  console.log("🚀 Inserting Payments Testing Guide Test Cases\n");

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

    // Define all payment test cases
    let testCases = [
      {
        id: "pay-004",
        title: "Payment Dashboard Metrics Display",
        category: "Payments",
        priority: "High",
        steps: [
          "Navigate to Payments section",
          "View dashboard metrics cards",
          "Check Total Payments count",
          "Verify Pending Payments count",
          "Check Completed Payments count",
          "Verify Failed Payments count",
          "Check Total Amount Processed",
        ],
        expected:
          "All metrics display correct numbers, metrics update when data changes, numbers properly formatted, no calculation errors",
        edge_cases: [
          "Test with zero payments",
          "test with very large amounts",
          "test with decimal calculations",
          "test with data updates",
        ],
      },
      {
        id: "pay-005",
        title: "Payment Dashboard Navigation",
        category: "Payments",
        priority: "High",
        steps: [
          "Click on Payments tab",
          "Click on other tabs (Agents, Companies)",
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
        id: "pay-006",
        title: "Payment Table Initial Load",
        category: "Payments",
        priority: "High",
        steps: [
          "Load Payments section",
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
        id: "pay-007",
        title: "Payment Table Column Sorting",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Click on Payment ID column header",
          "Click on Amount column header",
          "Click on Date column header",
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
        id: "pay-008",
        title: "Payment Table Pagination",
        category: "Payments",
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
        id: "pay-009",
        title: "Payment Search Functionality",
        category: "Payments",
        priority: "High",
        steps: [
          "Enter search terms in search box",
          "Test payment ID searches",
          "Test amount searches",
          "Test customer name searches",
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
        id: "pay-010",
        title: "Payment Filter by Status",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Filter by Pending payments",
          "Filter by Completed payments",
          "Filter by Failed payments",
          "Filter by Cancelled payments",
          "Test multiple status selections",
        ],
        expected:
          "Status filters work correctly, multiple statuses can be selected, table updates immediately, filter counts are accurate",
        edge_cases: [
          "Test with no payments in status",
          "test with all statuses selected",
          "test with status changes during filtering",
        ],
      },
      {
        id: "pay-011",
        title: "Payment Filter by Date Range",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Select start date",
          "Select end date",
          "Test date range validation",
          "Verify filtered results",
          "Test clear filter option",
        ],
        expected:
          "Date range filters work correctly, validation prevents invalid ranges, filtered results accurate, clear option works",
        edge_cases: [
          "Test with future dates",
          "test with very old dates",
          "test with invalid date ranges",
          "test with timezone differences",
        ],
      },
      {
        id: "pay-012",
        title: "Payment Filter by Amount Range",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Enter minimum amount",
          "Enter maximum amount",
          "Test amount validation",
          "Verify filtered results",
          "Test clear filter option",
        ],
        expected:
          "Amount range filters work correctly, validation prevents invalid amounts, filtered results accurate, clear option works",
        edge_cases: [
          "Test with negative amounts",
          "test with very large amounts",
          "test with decimal precision",
          "test with currency symbols",
        ],
      },
      {
        id: "pay-013",
        title: "Add New Payment - Form Display",
        category: "Payments",
        priority: "High",
        steps: [
          "Click Add New Payment button",
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
        id: "pay-014",
        title: "Add New Payment - Required Field Validation",
        category: "Payments",
        priority: "High",
        steps: [
          "Leave Amount empty",
          "Leave Customer empty",
          "Leave Payment Method empty",
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
        id: "pay-015",
        title: "Add New Payment - Field Format Validation",
        category: "Payments",
        priority: "High",
        steps: [
          "Enter invalid amount format",
          "Enter invalid email format",
          "Enter invalid phone format",
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
        id: "pay-016",
        title: "Add New Payment - Successful Submission",
        category: "Payments",
        priority: "High",
        steps: [
          "Fill all required fields correctly",
          "Fill optional fields",
          "Select payment method",
          "Submit form",
          "Verify payment appears in table",
        ],
        expected:
          "Form submits successfully, new payment appears in table, success message displayed, modal closes automatically",
        edge_cases: [
          "Test with maximum field lengths",
          "test with special characters",
          "test with large amounts",
          "test with concurrent submissions",
        ],
      },
      {
        id: "pay-017",
        title: "Edit Payment - Form Population",
        category: "Payments",
        priority: "High",
        steps: [
          "Click Edit button on existing payment",
          "Verify modal opens with current data",
          "Check all fields populated correctly",
          "Verify amount displays correctly",
          "Test field editing",
        ],
        expected:
          "Edit form opens with current payment data, all fields populated correctly, amount displays properly, form is editable",
        edge_cases: [
          "Test with payments having all fields filled",
          "test with payments missing optional fields",
          "test with payments having special characters",
        ],
      },
      {
        id: "pay-018",
        title: "Edit Payment - Data Updates",
        category: "Payments",
        priority: "High",
        steps: [
          "Modify payment amount",
          "Change customer information",
          "Update payment method",
          "Change payment status",
          "Save changes",
          "Verify updates reflected",
        ],
        expected:
          "Changes saved successfully, updated information displays correctly in table, no data corruption occurs, success message shown",
        edge_cases: [
          "Test with concurrent edits",
          "test with invalid data",
          "test with network interruption",
          "test with large amount updates",
        ],
      },
      {
        id: "pay-019",
        title: "Delete Payment - Confirmation Dialog",
        category: "Payments",
        priority: "High",
        steps: [
          "Click Delete button on payment",
          "Verify confirmation dialog appears",
          "Check dialog text is clear",
          "Test dialog close button",
          "Verify dialog positioning",
        ],
        expected:
          "Confirmation dialog appears correctly, text is clear and informative, close button works, dialog properly positioned",
        edge_cases: [
          "Test with different screen sizes",
          "test with long payment IDs",
          "test with special characters in IDs",
          "test with browser zoom",
        ],
      },
      {
        id: "pay-020",
        title: "Delete Payment - Successful Deletion",
        category: "Payments",
        priority: "High",
        steps: [
          "Confirm payment deletion",
          "Verify payment removed from table",
          "Check metrics update correctly",
          "Verify no errors occur",
          "Test table refresh",
        ],
        expected:
          "Payment permanently deleted, table updates immediately, metrics recalculated, success message displayed, no errors",
        edge_cases: [
          "Test with payments having relationships",
          "test with payments having attachments",
          "test with network failure during deletion",
          "test with browser refresh during process",
        ],
      },
      {
        id: "pay-021",
        title: "Credit Card Payment Method",
        category: "Payments",
        priority: "High",
        steps: [
          "Select Credit Card payment method",
          "Enter card number",
          "Enter expiry date",
          "Enter CVV",
          "Enter cardholder name",
          "Submit payment",
        ],
        expected:
          "Credit card form displays correctly, validation works, payment processes successfully, confirmation message shown",
        edge_cases: [
          "Test with invalid card numbers",
          "test with expired cards",
          "test with invalid CVV",
          "test with special characters in names",
        ],
      },
      {
        id: "pay-022",
        title: "Bank Transfer Payment Method",
        category: "Payments",
        priority: "High",
        steps: [
          "Select Bank Transfer payment method",
          "Enter account number",
          "Enter routing number",
          "Enter account holder name",
          "Submit payment",
        ],
        expected:
          "Bank transfer form displays correctly, validation works, payment processes successfully, confirmation message shown",
        edge_cases: [
          "Test with invalid account numbers",
          "test with invalid routing numbers",
          "test with special characters in names",
          "test with very long account numbers",
        ],
      },
      {
        id: "pay-023",
        title: "Digital Wallet Payment Method",
        category: "Payments",
        priority: "High",
        steps: [
          "Select Digital Wallet payment method",
          "Choose wallet type (PayPal, Apple Pay, Google Pay)",
          "Enter wallet credentials",
          "Submit payment",
        ],
        expected:
          "Digital wallet form displays correctly, wallet selection works, payment processes successfully, confirmation message shown",
        edge_cases: [
          "Test with invalid wallet credentials",
          "test with unsupported wallet types",
          "test with network failures",
          "test with wallet timeouts",
        ],
      },
      {
        id: "pay-024",
        title: "Cash Payment Method",
        category: "Payments",
        priority: "High",
        steps: [
          "Select Cash payment method",
          "Enter amount received",
          "Calculate change",
          "Confirm payment",
          "Generate receipt",
        ],
        expected:
          "Cash payment form displays correctly, change calculation accurate, receipt generated, payment confirmed",
        edge_cases: [
          "Test with insufficient cash",
          "test with exact amounts",
          "test with very large amounts",
          "test with decimal amounts",
        ],
      },
      {
        id: "pay-025",
        title: "Payment Processing - Success",
        category: "Payments",
        priority: "High",
        steps: [
          "Submit valid payment",
          "Wait for processing",
          "Verify success status",
          "Check confirmation email",
          "Verify payment in table",
        ],
        expected:
          "Payment processes successfully, status updates to completed, confirmation email sent, payment appears in completed list",
        edge_cases: [
          "Test with different payment methods",
          "test with various amounts",
          "test with different currencies",
          "test with network delays",
        ],
      },
      {
        id: "pay-026",
        title: "Payment Processing - Failure",
        category: "Payments",
        priority: "High",
        steps: [
          "Submit invalid payment",
          "Wait for processing",
          "Verify failure status",
          "Check error message",
          "Verify payment in failed list",
        ],
        expected:
          "Payment fails appropriately, status updates to failed, clear error message displayed, payment appears in failed list",
        edge_cases: [
          "Test with expired cards",
          "test with insufficient funds",
          "test with invalid credentials",
          "test with network failures",
        ],
      },
      {
        id: "pay-027",
        title: "Payment Processing - Pending",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Submit payment requiring approval",
          "Verify pending status",
          "Check approval workflow",
          "Approve payment",
          "Verify completion",
        ],
        expected:
          "Payment shows pending status, approval workflow accessible, approval process works, status updates correctly",
        edge_cases: [
          "Test with different approval levels",
          "test with multiple approvers",
          "test with approval timeouts",
          "test with approval rejections",
        ],
      },
      {
        id: "pay-028",
        title: "Payment Refund - Full Refund",
        category: "Payments",
        priority: "High",
        steps: [
          "Select completed payment",
          "Click Refund button",
          "Select full refund option",
          "Enter refund reason",
          "Process refund",
        ],
        expected:
          "Refund form displays correctly, full refund processes successfully, payment status updates, refund confirmation shown",
        edge_cases: [
          "Test with different payment methods",
          "test with various amounts",
          "test with different currencies",
          "test with network delays",
        ],
      },
      {
        id: "pay-029",
        title: "Payment Refund - Partial Refund",
        category: "Payments",
        priority: "High",
        steps: [
          "Select completed payment",
          "Click Refund button",
          "Select partial refund option",
          "Enter refund amount",
          "Enter refund reason",
          "Process refund",
        ],
        expected:
          "Partial refund form displays correctly, amount validation works, refund processes successfully, status updates correctly",
        edge_cases: [
          "Test with amounts larger than original",
          "test with decimal amounts",
          "test with zero amounts",
          "test with negative amounts",
        ],
      },
      {
        id: "pay-030",
        title: "Payment Refund - Refund Status Tracking",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Process refund",
          "Check refund status",
          "Monitor status updates",
          "Verify completion",
          "Check refund confirmation",
        ],
        expected:
          "Refund status tracks correctly, updates display in real-time, completion confirmed, refund confirmation generated",
        edge_cases: [
          "Test with network delays",
          "test with system failures",
          "test with concurrent refunds",
          "test with large amounts",
        ],
      },
      {
        id: "pay-031",
        title: "Payment Reports - Daily Summary",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Navigate to Reports section",
          "Select Daily Summary report",
          "Choose date range",
          "Generate report",
          "Verify report accuracy",
        ],
        expected:
          "Daily summary report generates correctly, data accurate, date range selection works, report displays properly",
        edge_cases: [
          "Test with no payments in range",
          "test with very large datasets",
          "test with different date formats",
          "test with timezone differences",
        ],
      },
      {
        id: "pay-032",
        title: "Payment Reports - Monthly Summary",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Navigate to Reports section",
          "Select Monthly Summary report",
          "Choose month and year",
          "Generate report",
          "Verify report accuracy",
        ],
        expected:
          "Monthly summary report generates correctly, data accurate, month/year selection works, report displays properly",
        edge_cases: [
          "Test with no payments in month",
          "test with leap years",
          "test with different fiscal years",
          "test with large amounts",
        ],
      },
      {
        id: "pay-033",
        title: "Payment Reports - Export Functionality",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Generate payment report",
          "Click Export button",
          "Choose export format (PDF, CSV, Excel)",
          "Download file",
          "Verify file content",
        ],
        expected:
          "Export functionality works correctly, all formats supported, file downloads successfully, content matches report",
        edge_cases: [
          "Test with large reports",
          "test with different browsers",
          "test with network interruptions",
          "test with different file formats",
        ],
      },
      {
        id: "pay-034",
        title: "Payment Data Encryption",
        category: "Payments",
        priority: "High",
        steps: [
          "Submit payment with sensitive data",
          "Check network traffic",
          "Verify data encryption",
          "Check database storage",
          "Verify PCI compliance",
        ],
        expected:
          "All sensitive payment data encrypted in transit and at rest, network traffic secure, database storage encrypted, PCI compliant",
        edge_cases: [
          "Test with different payment methods",
          "test with various data types",
          "test with network sniffing",
          "test with database access",
        ],
      },
      {
        id: "pay-035",
        title: "Payment Authentication",
        category: "Payments",
        priority: "High",
        steps: [
          "Attempt payment without authentication",
          "Verify access denied",
          "Login with valid credentials",
          "Attempt payment again",
          "Verify success",
        ],
        expected:
          "Authentication required for payments, access denied without credentials, payment succeeds with valid authentication",
        edge_cases: [
          "Test with expired sessions",
          "test with invalid credentials",
          "test with multiple user accounts",
          "test with role-based access",
        ],
      },
      {
        id: "pay-036",
        title: "Payment Fraud Detection",
        category: "Payments",
        priority: "High",
        steps: [
          "Submit suspicious payment",
          "Verify fraud detection triggers",
          "Check payment review process",
          "Verify manual review option",
          "Test fraud prevention",
        ],
        expected:
          "Fraud detection works correctly, suspicious payments flagged, review process accessible, prevention measures effective",
        edge_cases: [
          "Test with various fraud patterns",
          "test with false positives",
          "test with different payment methods",
          "test with international payments",
        ],
      },
      {
        id: "pay-037",
        title: "Payment Gateway Integration",
        category: "Payments",
        priority: "High",
        steps: [
          "Submit payment through gateway",
          "Verify gateway communication",
          "Check response handling",
          "Verify payment processing",
          "Test error handling",
        ],
        expected:
          "Gateway integration works correctly, communication successful, responses handled properly, payments process successfully",
        edge_cases: [
          "Test with gateway failures",
          "test with network timeouts",
          "test with invalid responses",
          "test with concurrent requests",
        ],
      },
      {
        id: "pay-038",
        title: "Payment Webhook Integration",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Process payment",
          "Verify webhook sent",
          "Check webhook payload",
          "Verify webhook delivery",
          "Test webhook retry",
        ],
        expected:
          "Webhooks sent correctly, payload contains accurate data, delivery successful, retry mechanism works",
        edge_cases: [
          "Test with webhook failures",
          "test with invalid payloads",
          "test with delivery delays",
          "test with multiple webhooks",
        ],
      },
      {
        id: "pay-039",
        title: "Payment API Integration",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Call payment API",
          "Verify API authentication",
          "Check request validation",
          "Verify response format",
          "Test error responses",
        ],
        expected:
          "API integration works correctly, authentication successful, validation effective, responses formatted properly",
        edge_cases: [
          "Test with invalid API keys",
          "test with malformed requests",
          "test with rate limiting",
          "test with API versioning",
        ],
      },
      {
        id: "pay-040",
        title: "Payment Processing Performance",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Submit multiple payments",
          "Monitor processing time",
          "Check system resources",
          "Verify response times",
          "Test concurrent payments",
        ],
        expected:
          "Payment processing performs well, response times acceptable, system resources stable, concurrent processing works",
        edge_cases: [
          "Test with high volume",
          "test with large amounts",
          "test with complex payment methods",
          "test with network delays",
        ],
      },
      {
        id: "pay-041",
        title: "Payment Report Generation Performance",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Generate large reports",
          "Monitor generation time",
          "Check memory usage",
          "Verify report accuracy",
          "Test export performance",
        ],
        expected:
          "Report generation performs well, memory usage stable, reports accurate, export functionality efficient",
        edge_cases: [
          "Test with very large datasets",
          "test with complex reports",
          "test with multiple exports",
          "test with system load",
        ],
      },
      {
        id: "pay-042",
        title: "Payment Network Error Handling",
        category: "Payments",
        priority: "High",
        steps: [
          "Disconnect network connection",
          "Attempt payment submission",
          "Verify error handling",
          "Reconnect network",
          "Verify recovery",
        ],
        expected:
          "Network errors handled gracefully, user informed of issues, retry options available, recovery successful",
        edge_cases: [
          "Test with intermittent connectivity",
          "test with slow network",
          "test with timeout scenarios",
          "test with server errors",
        ],
      },
      {
        id: "pay-043",
        title: "Payment Form Error Recovery",
        category: "Payments",
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
        id: "pay-044",
        title: "Payment Keyboard Navigation",
        category: "Payments",
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
        id: "pay-045",
        title: "Payment Screen Reader Compatibility",
        category: "Payments",
        priority: "High",
        steps: [
          "Enable screen reader software",
          "Navigate through payment form",
          "Verify proper labeling",
          "Check semantic structure",
          "Test form accessibility",
        ],
        expected:
          "Screen reader announces elements correctly, form labels properly associated, semantic structure clear, navigation logical",
        edge_cases: [
          "Test with different screen readers",
          "test with different languages",
          "test with complex forms",
          "test with dynamic content",
        ],
      },
      {
        id: "pay-046",
        title: "Payment Chrome Compatibility",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Test all payment features in Chrome",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify payment processing",
        ],
        expected:
          "All payment features work correctly, JavaScript executes properly, CSS renders as expected, payments process successfully",
        edge_cases: [
          "Test with different Chrome versions",
          "test with Chrome extensions",
          "test with Chrome DevTools",
          "test with Chrome flags",
        ],
      },
      {
        id: "pay-047",
        title: "Payment Firefox Compatibility",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Test all payment features in Firefox",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify payment processing",
        ],
        expected:
          "All payment features work correctly, JavaScript executes properly, CSS renders as expected, payments process successfully",
        edge_cases: [
          "Test with different Firefox versions",
          "test with Firefox add-ons",
          "test with Firefox Developer Tools",
          "test with Firefox preferences",
        ],
      },
      {
        id: "pay-048",
        title: "Payment Safari Compatibility",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Test all payment features in Safari",
          "Verify JavaScript functionality",
          "Check CSS rendering",
          "Test form submissions",
          "Verify payment processing",
        ],
        expected:
          "All payment features work correctly, JavaScript executes properly, CSS renders as expected, payments process successfully",
        edge_cases: [
          "Test with different Safari versions",
          "test with Safari Developer Tools",
          "test with Safari preferences",
          "test with Safari extensions",
        ],
      },
      {
        id: "pay-049",
        title: "Payment Desktop Layout (1920x1080)",
        category: "Payments",
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
        id: "pay-050",
        title: "Payment Tablet Layout (768x1024)",
        category: "Payments",
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
        id: "pay-051",
        title: "Payment Mobile Layout (375x667)",
        category: "Payments",
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
        id: "pay-052",
        title: "Payment Empty State Handling",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Test with no payments data",
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
        id: "pay-053",
        title: "Payment Large Dataset Handling",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Test with 1000+ payments",
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
        id: "pay-054",
        title: "Payment Tax Calculation",
        category: "Payments",
        priority: "High",
        steps: [
          "Enter payment amount",
          "Select tax rate",
          "Verify tax calculation",
          "Check total amount",
          "Verify calculation accuracy",
        ],
        expected:
          "Tax calculations are accurate, different rates work correctly, totals calculated properly, no calculation errors",
        edge_cases: [
          "Test with zero tax rates",
          "test with very high tax rates",
          "test with decimal precision",
          "test with different currencies",
        ],
      },
      {
        id: "pay-055",
        title: "Payment Discount Application",
        category: "Payments",
        priority: "High",
        steps: [
          "Enter payment amount",
          "Apply discount percentage",
          "Verify discount calculation",
          "Check final amount",
          "Verify calculation accuracy",
        ],
        expected:
          "Discount calculations are accurate, different percentages work correctly, final amounts calculated properly, no calculation errors",
        edge_cases: [
          "Test with zero discounts",
          "test with 100% discounts",
          "test with decimal precision",
          "test with very large amounts",
        ],
      },
      {
        id: "pay-056",
        title: "Payment Currency Conversion",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Select source currency",
          "Select target currency",
          "Enter amount",
          "Verify conversion rate",
          "Check converted amount",
        ],
        expected:
          "Currency conversion works correctly, rates accurate, converted amounts calculated properly, no conversion errors",
        edge_cases: [
          "Test with different currency pairs",
          "test with very large amounts",
          "test with decimal precision",
          "test with exchange rate updates",
        ],
      },
      {
        id: "pay-057",
        title: "Payment PCI DSS Compliance",
        category: "Payments",
        priority: "High",
        steps: [
          "Verify card data encryption",
          "Check secure transmission",
          "Verify secure storage",
          "Test access controls",
          "Verify audit logging",
        ],
        expected:
          "PCI DSS compliance maintained, card data properly secured, access controls effective, audit logging comprehensive",
        edge_cases: [
          "Test with different card types",
          "test with various data formats",
          "test with access attempts",
          "test with audit reviews",
        ],
      },
      {
        id: "pay-058",
        title: "Payment GDPR Compliance",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Verify data consent",
          "Check data retention",
          "Test data deletion",
          "Verify user rights",
          "Check privacy notices",
        ],
        expected:
          "GDPR compliance maintained, user consent properly handled, data retention policies followed, user rights respected",
        edge_cases: [
          "Test with different user types",
          "test with various consent scenarios",
          "test with data requests",
          "test with privacy updates",
        ],
      },
      {
        id: "pay-059",
        title: "Payment Analytics Dashboard",
        category: "Payments",
        priority: "Medium",
        steps: [
          "Navigate to Analytics section",
          "View payment trends",
          "Check conversion rates",
          "Verify revenue metrics",
          "Test date range selection",
        ],
        expected:
          "Analytics dashboard displays correctly, trends visible, metrics accurate, date selection works, data updates properly",
        edge_cases: [
          "Test with different date ranges",
          "test with various metrics",
          "test with large datasets",
          "test with real-time updates",
        ],
      },
      {
        id: "pay-060",
        title: "Payment Performance Metrics",
        category: "Payments",
        priority: "Medium",
        steps: [
          "View payment performance",
          "Check success rates",
          "Verify processing times",
          "Test failure analysis",
          "Monitor system health",
        ],
        expected:
          "Performance metrics display correctly, success rates accurate, processing times tracked, failure analysis comprehensive",
        edge_cases: [
          "Test with different time periods",
          "test with various payment methods",
          "test with system load",
          "test with error conditions",
        ],
      },
    ];

    // Check if tests already exist
    const { data: existingTests, error: checkError } = await supabase
      .from("qa_tests")
      .select("id")
      .eq("category", "Payments")
      .limit(1);

    if (checkError) {
      console.error("❌ Cannot check existing tests:", checkError.message);
      return;
    }

    if (existingTests && existingTests.length > 0) {
      console.log("ℹ️  Payments tests already exist in database");
      console.log("Checking for existing test IDs to avoid duplicates...");

      // Get existing test IDs to avoid conflicts
      const { data: allExistingTests, error: allError } = await supabase
        .from("qa_tests")
        .select("id")
        .eq("category", "Payments");

      if (allError) {
        console.error("❌ Cannot get existing test IDs:", allError.message);
        return;
      }

      const existingIds = allExistingTests.map((t) => t.id);
      console.log(
        `Found ${existingIds.length} existing Payments tests:`,
        existingIds
      );

      // Filter out tests that already exist
      const newTestCases = testCases.filter(
        (test) => !existingIds.includes(test.id)
      );

      if (newTestCases.length === 0) {
        console.log("✅ All Payments tests already exist in database");
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
      `\n📊 Payments insertion completed: ${insertedCount}/${testCases.length} tests inserted`
    );
  } catch (error) {
    console.error("❌ Payments insertion failed:", error.message);
  }
}

// Main execution
async function main() {
  console.log("🔍 Payments Testing Guide Database Insertion");
  console.log("=".repeat(60));

  await insertPaymentsTests();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { insertPaymentsTests };
