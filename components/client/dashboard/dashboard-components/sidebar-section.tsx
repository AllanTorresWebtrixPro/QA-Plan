"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Test {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  expected: string;
  steps: string[];
  edgeCases: string[];
  notes?: string;
}

interface UserStats {
  completed: number;
  total: number;
  percentage: number;
  highPriorityRemaining: number;
}

interface AllUserStats {
  user: User;
  completed: number;
  total: number;
  percentage: number;
}

interface SidebarSectionProps {
  currentUserStats: UserStats;
  allUsersStats: AllUserStats[];
  allTests: Test[]; // Add all tests data
}

export function SidebarSection({
  currentUserStats,
  allUsersStats,
  allTests,
}: SidebarSectionProps) {
  // Calculate real totals from actual test data
  const totalCompleted = allUsersStats.reduce(
    (sum, user) => sum + user.completed,
    0
  );

  // Calculate total high priority tests from actual test data
  const totalHighPriorityTests = allTests.filter(
    (test) => test.priority === "High"
  ).length;
  const completedHighPriorityTests = allTests.filter(
    (test) => test.priority === "High" && test.completed
  ).length;
  const totalHighPriorityRemaining =
    totalHighPriorityTests - completedHighPriorityTests;

  const activeUsers = allUsersStats.length;

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="h-5 w-5" />
            Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {currentUserStats.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700 font-medium">
                Completion Rate
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="text-lg font-semibold text-green-600">
                  {currentUserStats.completed}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="text-lg font-semibold text-red-600">
                  {currentUserStats.highPriorityRemaining}
                </div>
                <div className="text-xs text-gray-600">High Priority</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-600">
                  {currentUserStats.percentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={currentUserStats.percentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced All Users Progress */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Users className="h-5 w-5" />
            Team Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allUsersStats.map((userStats) => (
              <div
                key={userStats.user.id}
                className="bg-white rounded-lg p-3 border border-green-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-green-100 text-green-700">
                        {userStats.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {userStats.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {userStats.completed}/{userStats.total} tests
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {userStats.percentage.toFixed(1)}%
                    </div>
                    <Badge
                      variant={
                        userStats.percentage >= 80
                          ? "default"
                          : userStats.percentage >= 50
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {userStats.percentage >= 80
                        ? "Excellent"
                        : userStats.percentage >= 50
                        ? "Good"
                        : "Needs Work"}
                    </Badge>
                  </div>
                </div>
                <Progress value={userStats.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <CheckCircle className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Total Completed</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {totalCompleted}
              </Badge>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">
                  High Priority Remaining
                </span>
              </div>
              <Badge variant="destructive">{totalHighPriorityRemaining}</Badge>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <Badge variant="secondary">{activeUsers}</Badge>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total Tests</span>
              </div>
              <Badge variant="outline">{allTests.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
