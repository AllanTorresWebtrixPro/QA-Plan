"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

interface MiscIssuesKPICardsProps {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  highPriorityIssues: number;
}

export function MiscIssuesKPICards({
  totalIssues,
  openIssues,
  inProgressIssues,
  resolvedIssues,
  highPriorityIssues,
}: MiscIssuesKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Issues */}
      <Card className="border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-700">{totalIssues}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Issues */}
      <Card className="border-blue-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-blue-700">{openIssues}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In Progress Issues */}
      <Card className="border-orange-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-700">{inProgressIssues}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resolved Issues */}
      <Card className="border-green-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-700">{resolvedIssues}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Issues */}
      <Card className="border-red-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-700">{highPriorityIssues}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
