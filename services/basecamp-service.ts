/**
 * Basecamp Service
 *
 * Handles all Basecamp API interactions including authentication,
 * card creation, project management, and column operations.
 */

import { getValidBasecampToken } from "./basecamp-token-service";

interface BasecampConfig {
  accountId: string;
  userAgent: string;
  projectId: string;
  cardTableId: string;
  defaultColumnId: string;
}

interface BasecampCard {
  title: string;
  content?: string;
  due_on?: string;
  notify?: boolean;
}

interface BasecampResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class BasecampService {
  private config: BasecampConfig;
  private baseUrl: string;
  private userId: string;

  constructor(config: BasecampConfig, userId: string) {
    this.config = config;
    this.userId = userId;
    this.baseUrl = `https://3.basecampapi.com/${config.accountId}`;
  }

  /**
   * Get authentication headers for Basecamp API requests
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const tokenResult = await getValidBasecampToken(this.userId);
    
    if (!tokenResult.success || !tokenResult.accessToken) {
      throw new Error(tokenResult.error || 'Failed to get valid access token');
    }

    return {
      Authorization: `Bearer ${tokenResult.accessToken}`,
      "User-Agent": this.config.userAgent,
      "Content-Type": "application/json",
    };
  }

  /**
   * Make a request to the Basecamp API
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<BasecampResponse> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Basecamp API Error: ${response.status} ${response.statusText}`,
          errorText
        );
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Basecamp API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get all projects in the account
   */
  async getProjects(): Promise<BasecampResponse> {
    return this.makeRequest("/projects.json");
  }

  /**
   * Get a specific project
   */
  async getProject(projectId: string): Promise<BasecampResponse> {
    return this.makeRequest(`/buckets/${projectId}.json`);
  }

  /**
   * Get card tables in a project
   */
  async getCardTables(projectId: string): Promise<BasecampResponse> {
    return this.makeRequest(`/buckets/${projectId}/card_tables.json`);
  }

  /**
   * Get a specific card table
   */
  async getCardTable(
    projectId: string,
    cardTableId: string
  ): Promise<BasecampResponse> {
    return this.makeRequest(
      `/buckets/${projectId}/card_tables/${cardTableId}.json`
    );
  }

  /**
   * Get columns in a card table
   */
  async getColumns(
    projectId: string,
    cardTableId: string
  ): Promise<BasecampResponse> {
    return this.makeRequest(
      `/buckets/${projectId}/card_tables/${cardTableId}/columns.json`
    );
  }

  /**
   * Create a card in a specific column
   */
  async createCard(
    projectId: string,
    columnId: string,
    cardData: BasecampCard
  ): Promise<BasecampResponse> {
    return this.makeRequest(
      `/buckets/${projectId}/card_tables/lists/${columnId}/cards.json`,
      {
        method: "POST",
        body: JSON.stringify(cardData),
      }
    );
  }

  /**
   * Create a card with test information
   */
  async createTestCard(
    userId: string,
    testId: string,
    notes: string,
    testTitle?: string
  ): Promise<BasecampResponse> {
    const cardTitle = `Test Note: ${testTitle || testId} (User: ${userId})`;
    const cardContent = `
      <strong>Test Information:</strong><br>
      <strong>User ID:</strong> ${userId}<br>
      <strong>Test ID:</strong> ${testId}<br>
      <strong>Test Title:</strong> ${testTitle || "N/A"}<br>
      <strong>Notes:</strong><br>
      ${notes.replace(/\n/g, "<br>")}<br>
      <br>
      <em>Created at: ${new Date().toISOString()}</em>
    `;

    const cardData: BasecampCard = {
      title: cardTitle,
      content: cardContent,
      notify: false,
    };

    return this.createCard(
      this.config.projectId,
      this.config.defaultColumnId,
      cardData
    );
  }

  /**
   * Update a card
   */
  async updateCard(
    projectId: string,
    cardId: string,
    cardData: Partial<BasecampCard>
  ): Promise<BasecampResponse> {
    return this.makeRequest(
      `/buckets/${projectId}/card_tables/cards/${cardId}.json`,
      {
        method: "PUT",
        body: JSON.stringify(cardData),
      }
    );
  }

  /**
   * Move a card to a different column
   */
  async moveCard(
    projectId: string,
    cardId: string,
    columnId: string
  ): Promise<BasecampResponse> {
    return this.makeRequest(
      `/buckets/${projectId}/card_tables/cards/${cardId}/moves.json`,
      {
        method: "POST",
        body: JSON.stringify({ column_id: columnId }),
      }
    );
  }

  /**
   * Get cards in a column
   */
  async getCardsInColumn(
    projectId: string,
    columnId: string
  ): Promise<BasecampResponse> {
    return this.makeRequest(
      `/buckets/${projectId}/card_tables/lists/${columnId}/cards.json`
    );
  }

  /**
   * Test the connection to Basecamp API
   */
  async testConnection(): Promise<BasecampResponse> {
    return this.makeRequest("/projects.json");
  }
}

/**
 * Create and configure Basecamp service instance
 */
export function createBasecampService(userId: string = 'default_user'): BasecampService {
  const config: BasecampConfig = {
    accountId: process.env.BASECAMP_ACCOUNT_ID!,
    userAgent:
      process.env.BASECAMP_USER_AGENT ||
      "QA-Plan (atorres@jokertechnologies.com)",
    projectId: process.env.BASECAMP_PROJECT_ID!,
    cardTableId: process.env.BASECAMP_CARD_TABLE_ID!,
    defaultColumnId: process.env.BASECAMP_DEFAULT_COLUMN_ID!,
  };

  // Validate required environment variables
  const requiredVars = [
    "accountId",
    "projectId",
    "cardTableId",
    "defaultColumnId",
  ];
  const missingVars = requiredVars.filter(
    (varName) => !config[varName as keyof BasecampConfig]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Basecamp environment variables: ${missingVars.join(
        ", "
      )}`
    );
  }

  return new BasecampService(config, userId);
}

export { BasecampService };
export type { BasecampCard, BasecampResponse, BasecampConfig };
