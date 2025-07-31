import { NextResponse } from "next/server";
import { createBasecampService } from "@/services/basecamp-service";

/**
 * GET /api/basecamp/config
 * Test Basecamp configuration and return available projects and card tables
 */
export async function GET() {
  try {
    const basecampService = createBasecampService("default_user");

    // Test connection
    const connectionTest = await basecampService.testConnection();

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to connect to Basecamp API",
          details: connectionTest.error,
        },
        { status: 500 }
      );
    }

    // Get projects
    const projectsResponse = await basecampService.getProjects();

    if (!projectsResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch projects",
          details: projectsResponse.error,
        },
        { status: 500 }
      );
    }

    const projects = projectsResponse.data || [];

    // Get card tables for the configured project
    const cardTablesResponse = await basecampService.getCardTables(
      process.env.BASECAMP_PROJECT_ID!
    );

    let cardTables = [];
    if (cardTablesResponse.success) {
      cardTables = cardTablesResponse.data || [];
    }

    // Get columns for the configured card table
    let columns = [];
    if (process.env.BASECAMP_CARD_TABLE_ID) {
      const columnsResponse = await basecampService.getColumns(
        process.env.BASECAMP_PROJECT_ID!,
        process.env.BASECAMP_CARD_TABLE_ID
      );

      if (columnsResponse.success) {
        columns = columnsResponse.data || [];
      }
    }

    return NextResponse.json({
      success: true,
      connection: "Connected successfully",
      currentConfig: {
        accountId: process.env.BASECAMP_ACCOUNT_ID,
        projectId: process.env.BASECAMP_PROJECT_ID,
        cardTableId: process.env.BASECAMP_CARD_TABLE_ID,
        defaultColumnId: process.env.BASECAMP_DEFAULT_COLUMN_ID,
        userAgent:
          process.env.BASECAMP_USER_AGENT ||
          "QA-Plan (atorres@jokertechnologies.com)",
      },
      availableProjects: projects,
      availableCardTables: cardTables,
      availableColumns: columns,
    });
  } catch (error) {
    console.error("Error testing Basecamp configuration:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Configuration error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/basecamp/config
 * Test creating a sample card
 */
export async function POST() {
  try {
    const basecampService = createBasecampService("default_user");

    // Create a test card
    const testResponse = await basecampService.createTestCard(
      "test-user",
      "test-test-id",
      "This is a test note to verify Basecamp integration is working correctly.",
      "Test Integration"
    );

    if (testResponse.success) {
      return NextResponse.json({
        success: true,
        message: "Test card created successfully",
        cardData: testResponse.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create test card",
          details: testResponse.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating test card:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Test card creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
