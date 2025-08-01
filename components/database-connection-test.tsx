"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Database,
  Users,
  FileText,
  Activity,
} from "lucide-react";

interface DatabaseStatus {
  connection: boolean;
  tables: {
    user_profiles: { exists: boolean; count: number };
    qa_tests: { exists: boolean; count: number };
    qa_user_test_progress: { exists: boolean; count: number };
  };
  environment: {
    supabaseUrl: boolean;
    supabaseKey: boolean;
  };
  errors: string[];
}

export function DatabaseConnectionTest() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastTested, setLastTested] = useState<Date | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const testDatabaseConnection = async () => {
    setLoading(true);
    const errors: string[] = [];
    const status: DatabaseStatus = {
      connection: false,
      tables: {
        user_profiles: { exists: false, count: 0 },
        qa_tests: { exists: false, count: 0 },
        qa_user_test_progress: { exists: false, count: 0 },
      },
      environment: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      errors: [],
    };

    try {
      // Test 1: Check environment variables
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL is not configured");
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
      }

      // Test 2: Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from("user_profiles")
        .select("count", { count: "exact", head: true });

      if (connectionError) {
        errors.push(`Connection failed: ${connectionError.message}`);
      } else {
        status.connection = true;
      }

      // Test 3: Check each table
      const tables = ["user_profiles", "qa_tests", "qa_user_test_progress"] as const;

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select("count", { count: "exact", head: true });

          if (error) {
            errors.push(`Table ${table} error: ${error.message}`);
            status.tables[table] = { exists: false, count: 0 };
          } else {
            status.tables[table] = {
              exists: true,
              count: data?.[0]?.count || 0,
            };
          }
        } catch (err) {
          errors.push(
            `Table ${table} failed: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
          status.tables[table] = { exists: false, count: 0 };
        }
      }

      // Test 4: Try to fetch some sample data
      try {
        const { data: users, error: usersError } = await supabase
          .from("user_profiles")
          .select("*")
          .limit(5);

        if (usersError) {
          errors.push(`Sample data fetch failed: ${usersError.message}`);
        }
      } catch (err) {
        errors.push(
          `Sample data fetch error: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    } catch (err) {
      errors.push(
        `General error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }

    status.errors = errors;
    setStatus(status);
    setLastTested(new Date());
    setLoading(false);
  };

  useEffect(() => {
    // Auto-test on component mount
    testDatabaseConnection();
  }, []);

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (condition: boolean) => {
    return condition ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Connected
      </Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection Test
          </CardTitle>
          <CardDescription>
            Comprehensive test to verify database connectivity and table
            structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="w-fit"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Testing..." : "Test Connection"}
            </Button>
            {lastTested && (
              <span className="text-sm text-muted-foreground">
                Last tested: {lastTested.toLocaleTimeString()}
              </span>
            )}
          </div>

          {status && (
            <div className="space-y-4">
              {/* Overall Connection Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.connection)}
                  <span className="font-medium">Database Connection</span>
                </div>
                {getStatusBadge(status.connection)}
              </div>

              {/* Environment Variables */}
              <div className="space-y-2">
                <h4 className="font-medium">Environment Variables</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Supabase URL</span>
                    {getStatusIcon(status.environment.supabaseUrl)}
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Supabase Key</span>
                    {getStatusIcon(status.environment.supabaseKey)}
                  </div>
                </div>
              </div>

              {/* Table Status */}
              <div className="space-y-2">
                <h4 className="font-medium">Database Tables</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Users</span>
                    </div>
                    <div className="text-right">
                      {getStatusIcon(status.tables.user_profiles.exists)}
                      <div className="text-xs text-muted-foreground">
                        {status.tables.user_profiles.count} records
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Tests</span>
                    </div>
                    <div className="text-right">
                      {getStatusIcon(status.tables.qa_tests.exists)}
                      <div className="text-xs text-muted-foreground">
                        {status.tables.qa_tests.count} records
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm">Progress</span>
                    </div>
                    <div className="text-right">
                      {getStatusIcon(
                        status.tables.qa_user_test_progress.exists
                      )}
                      <div className="text-xs text-muted-foreground">
                        {status.tables.qa_user_test_progress.count} records
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {status.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Errors Found</h4>
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {status.errors.map((error, index) => (
                          <li key={index} className="text-sm">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Test Summary</h4>
                <div className="text-sm space-y-1">
                  <div>
                    Connection: {status.connection ? "✅ Working" : "❌ Failed"}
                  </div>
                  <div>
                    Environment:{" "}
                    {status.environment.supabaseUrl &&
                    status.environment.supabaseKey
                      ? "✅ Configured"
                      : "❌ Missing"}
                  </div>
                  <div>
                    Tables:{" "}
                    {
                      Object.values(status.tables).filter((t) => t.exists)
                        .length
                    }
                    /3 tables found
                  </div>
                  <div>Errors: {status.errors.length} issues detected</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
