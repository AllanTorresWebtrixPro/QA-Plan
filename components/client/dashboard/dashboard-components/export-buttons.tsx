"use client";

import { Button } from "@/components/ui/button";
import { Database, Download, FileDown, Loader2 } from "lucide-react";

interface ExportButtonsProps {
  onExportUser: () => void;
  onExportAllUsers: () => void;
  isExportUserPending: boolean;
  isExportAllUsersPending: boolean;
}

export function ExportButtons({
  onExportUser,
  onExportAllUsers,
  isExportUserPending,
  isExportAllUsersPending,
}: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onExportUser}
        disabled={isExportUserPending}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isExportUserPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        Export My Results
      </Button>
      <Button
        onClick={onExportAllUsers}
        disabled={isExportAllUsersPending}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isExportAllUsersPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export All Users
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
}
