"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface UserStats {
  completed: number;
  total: number;
  percentage: number;
  highPriorityRemaining: number;
}

interface ProgressSectionProps {
  currentUserObject: User | undefined;
  currentUserStats: UserStats;
}

export function ProgressSection({
  currentUserObject,
  currentUserStats,
}: ProgressSectionProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-600">
            {currentUserObject?.name || "Current User"}'s Progress
          </span>
          <Badge variant="outline" className="text-xs">
            DB Synced
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Progress:</span>
        </div>
        <div className="flex-1 max-w-md">
          <Progress value={currentUserStats.percentage} className="h-2" />
        </div>
        <span className="text-sm text-gray-600">
          {currentUserStats.completed} of {currentUserStats.total} tests
          completed ({currentUserStats.percentage.toFixed(0)}%)
        </span>
      </div>
    </>
  );
}
