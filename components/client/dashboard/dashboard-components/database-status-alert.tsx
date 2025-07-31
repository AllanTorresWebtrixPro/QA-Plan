"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Wifi, WifiOff } from "lucide-react";

interface DatabaseStatus {
  connected: boolean;
  userCount?: number;
  error?: string;
}

interface DatabaseStatusAlertProps {
  dbStatus: DatabaseStatus | null | undefined;
}

export function DatabaseStatusAlert({ dbStatus }: DatabaseStatusAlertProps) {
  if (!dbStatus) return null;

  return (
    <Alert
      className={`${
        dbStatus.connected
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {dbStatus.connected ? (
          <>
            <Wifi className="h-4 w-4 text-green-600" />
            <Database className="h-4 w-4 text-green-600" />
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-600" />
            <Database className="h-4 w-4 text-red-600" />
          </>
        )}
      </div>
      <AlertDescription>
        {dbStatus.connected ? (
          <span className="text-green-800">
            ✅ Database Connected - {dbStatus.userCount ?? 0} users found.
            Progress is being saved to database.
          </span>
        ) : (
          <span className="text-red-800">
            ❌ Database Connection Failed: {dbStatus.error}. Using local storage
            fallback.
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}
