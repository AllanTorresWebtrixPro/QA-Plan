"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";

interface BasecampConfig {
  accountId: string;
  accessToken: string;
  projectId: string;
  cardTableId: string;
  defaultColumnId: string;
  userAgent: string;
}

interface BasecampProject {
  id: number;
  name: string;
  type: string;
}

interface BasecampCardTable {
  id: number;
  title: string;
  type: string;
}

interface BasecampColumn {
  id: number;
  title: string;
  type: string;
}

export default function BasecampConfigPage() {
  const [config, setConfig] = useState<BasecampConfig>({
    accountId: "",
    accessToken: "",
    projectId: "",
    cardTableId: "",
    defaultColumnId: "",
    userAgent: "QA-Plan (atorres@jokertechnologies.com)",
  });

  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<BasecampProject[]>([]);
  const [cardTables, setCardTables] = useState<BasecampCardTable[]>([]);
  const [columns, setColumns] = useState<BasecampColumn[]>([]);
  const [oauthStatus, setOauthStatus] = useState<string>('');

  useEffect(() => {
    // Load current configuration from environment (if available)
    loadCurrentConfig();
    
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const accessToken = urlParams.get('access_token');
    
    if (success === 'true' && accessToken) {
      setOauthStatus('success');
      // Auto-fill the access token
      setConfig(prev => ({ ...prev, accessToken }));
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setOauthStatus('error');
      setTestResult({
        success: false,
        error: 'OAuth Error',
        details: error
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch("/api/basecamp/config");
      const data = await response.json();

      if (data.success && data.currentConfig) {
        setConfig({
          accountId: data.currentConfig.accountId || "",
          accessToken: data.currentConfig.accessToken || "",
          projectId: data.currentConfig.projectId || "",
          cardTableId: data.currentConfig.cardTableId || "",
          defaultColumnId: data.currentConfig.defaultColumnId || "",
          userAgent:
            data.currentConfig.userAgent ||
            "QA-Plan (atorres@jokertechnologies.com)",
        });

        setProjects(data.availableProjects || []);
        setCardTables(data.availableCardTables || []);
        setColumns(data.availableColumns || []);
      }
    } catch (error) {
      console.error("Failed to load current config:", error);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/basecamp/config");
      const data = await response.json();

      setTestResult(data);

      if (data.success) {
        setProjects(data.availableProjects || []);
        setCardTables(data.availableCardTables || []);
        setColumns(data.availableColumns || []);
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: "Failed to test connection",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestCard = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/basecamp/config", {
        method: "POST",
      });
      const data = await response.json();

      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        error: "Failed to create test card",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnvFile = () => {
    const envContent = `# Basecamp API Configuration
BASECAMP_ACCOUNT_ID=${config.accountId}
BASECAMP_ACCESS_TOKEN=${config.accessToken || 'your_access_token_here'}
BASECAMP_USER_AGENT=${config.userAgent}
BASECAMP_PROJECT_ID=${config.projectId}
BASECAMP_CARD_TABLE_ID=${config.cardTableId}
BASECAMP_DEFAULT_COLUMN_ID=${config.defaultColumnId}

# OAuth Configuration (for getting access tokens)
BASECAMP_CLIENT_ID=your_client_id_here
BASECAMP_CLIENT_SECRET=your_client_secret_here
BASECAMP_REDIRECT_URI=${window.location.origin}/api/auth/basecamp/callback
`;

    const blob = new Blob([envContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env.local";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Basecamp Integration Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure your Basecamp API integration to automatically create
            cards when users add test notes.
          </p>
        </div>
        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? "Testing..." : "Test Connection"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Set up your Basecamp API credentials and project settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountId">Account ID</Label>
              <Input
                id="accountId"
                value={config.accountId}
                onChange={(e) =>
                  setConfig({ ...config, accountId: e.target.value })
                }
                placeholder="Your Basecamp account ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userAgent">User Agent</Label>
              <Input
                id="userAgent"
                value={config.userAgent}
                onChange={(e) =>
                  setConfig({ ...config, userAgent: e.target.value })
                }
                placeholder="Your app name (yourname@example.com)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessToken">Access Token</Label>
              <div className="flex gap-2">
                <Input
                  id="accessToken"
                  type="password"
                  value={config.accessToken}
                  onChange={(e) =>
                    setConfig({ ...config, accessToken: e.target.value })
                  }
                  placeholder="Your Basecamp access token"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('/api/auth/basecamp/authorize', '_blank')}
                >
                  Get Token
                </Button>
              </div>
              {oauthStatus === 'success' && (
                <p className="text-sm text-green-600">✅ OAuth authorization successful!</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                value={config.projectId}
                onChange={(e) =>
                  setConfig({ ...config, projectId: e.target.value })
                }
                placeholder="Basecamp project ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardTableId">Card Table ID</Label>
              <Input
                id="cardTableId"
                value={config.cardTableId}
                onChange={(e) =>
                  setConfig({ ...config, cardTableId: e.target.value })
                }
                placeholder="Card table ID within the project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultColumnId">Default Column ID</Label>
              <Input
                id="defaultColumnId"
                value={config.defaultColumnId}
                onChange={(e) =>
                  setConfig({ ...config, defaultColumnId: e.target.value })
                }
                placeholder="Default column ID for new cards"
              />
            </div>

            <Button onClick={generateEnvFile} className="w-full">
              Generate .env.local File
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Connection status and available resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResult && (
              <Alert
                className={
                  testResult.success ? "border-green-500" : "border-red-500"
                }
              >
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>
                  {testResult.success
                    ? "Connection successful!"
                    : testResult.error}
                  {testResult.details && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {testResult.details}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {projects.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Available Projects</h3>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{project.name}</span>
                      <Badge variant="secondary">{project.id}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cardTables.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Available Card Tables</h3>
                <div className="space-y-2">
                  {cardTables.map((table) => (
                    <div
                      key={table.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{table.title}</span>
                      <Badge variant="secondary">{table.id}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {columns.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Available Columns</h3>
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{column.title}</span>
                      <Badge variant="secondary">{column.id}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <Button
              onClick={createTestCard}
              disabled={isLoading || !testResult?.success}
            >
              {isLoading ? "Creating..." : "Create Test Card"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">1. Get Basecamp API Access</h3>
            <p className="text-sm text-muted-foreground">
              You need to create a Basecamp API application and get an access
              token. Visit the{" "}
              <a
                href="https://github.com/basecamp/api/blob/master/sections/authentication.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Basecamp Authentication Guide{" "}
                <ExternalLink className="inline h-3 w-3" />
              </a>{" "}
              for detailed instructions.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">2. Find Your Account ID</h3>
            <p className="text-sm text-muted-foreground">
              Your account ID is the number in the URL when you're logged into
              Basecamp. It appears in URLs like:
              https://3.basecamp.com/ACCOUNT_ID/
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">
              3. Find Project and Card Table IDs
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the "Test Connection" button above to discover your available
              projects, card tables, and columns. Copy the IDs to the
              configuration form.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">4. Environment Variables</h3>
            <p className="text-sm text-muted-foreground">
              Use the "Generate .env.local File" button to create a template,
              then add your actual access token. Place the file in your project
              root.
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Never commit your access token to
              version control. The .env.local file should be added to your
              .gitignore file.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
