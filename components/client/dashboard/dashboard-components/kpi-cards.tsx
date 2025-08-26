"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Users } from "lucide-react";

interface KPICardsProps {
  totalCompleted: number;
  totalHighPriorityRemaining: number;
  activeUsers: number;
  totalTests: number;
}

export function KPICards({
  totalCompleted,
  totalHighPriorityRemaining,
  activeUsers,
  totalTests,
}: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Completed */}
      <Card className="border-green-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-green-700">{totalCompleted}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Remaining */}
      <Card className="border-red-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority Remaining</p>
                <p className="text-2xl font-bold text-red-700">{totalHighPriorityRemaining}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="border-blue-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-700">{activeUsers}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Tests */}
      <Card className="border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-700">{totalTests}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
