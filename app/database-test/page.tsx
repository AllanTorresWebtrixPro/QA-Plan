import { DatabaseConnectionTest } from "@/components/database-connection-test";

export default function DatabaseTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Database Connection Test</h1>
          <p className="text-muted-foreground">
            This page tests the database connection and verifies that all
            required tables and data are properly configured.
          </p>
        </div>

        <DatabaseConnectionTest />
      </div>
    </div>
  );
}
