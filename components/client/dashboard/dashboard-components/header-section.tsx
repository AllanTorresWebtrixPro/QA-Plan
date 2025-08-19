"use client";

import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface UserStats {
  completed: number;
  total: number;
  percentage: number;
  highPriorityRemaining: number;
}

interface DatabaseStatus {
  connected: boolean;
  userCount?: number;
  error?: string;
}

interface HeaderSectionProps {
  dbStatus: DatabaseStatus | null | undefined;
}

export function HeaderSection({
  dbStatus,
}: HeaderSectionProps) {

  return (
    <div className="flex justify-end">
      {dbStatus?.connected ? (
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          <Wifi className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      )}
    </div>
  );
}
