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
  activeTab: string;
  filteredTests: Test[];
  currentUserObject: User | undefined;
}

export function SidebarSection({
  currentUserStats,
  allUsersStats,
  allTests,
  activeTab,
  filteredTests,
  currentUserObject,
}: SidebarSectionProps) {

  return (
    <div className="space-y-6">
      {/* Combined Progress Summary & Test Categories */}
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-blue-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold">
                {activeTab === "All" && "Progress Summary"}
                {activeTab === "Summary" && "Progress by Category"}
                {activeTab !== "All" &&
                  activeTab !== "Summary" &&
                  `${activeTab} Test Categories`}
              </div>
              <div className="text-xs text-blue-600 font-medium">
                {activeTab === "All" && "Overall completion overview"}
                {activeTab === "Summary" && "Detailed category breakdown"}
                {activeTab !== "All" &&
                  activeTab !== "Summary" &&
                  "Category-specific progress"}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeTab === "All" && (
              <>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {currentUserStats.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-700 font-medium mt-1">
                    Completion Rate
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {currentUserStats.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={currentUserStats.percentage} className="h-3 bg-blue-100" />
                </div>
              </>
            )}

            {activeTab === "Summary" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {filteredTests.filter((t) => t.completed).length}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">Completed Tests</div>
                      <div className="text-xs text-gray-500 mt-1">
                        of {filteredTests.length} total
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {filteredTests.filter((t) => !t.completed && t.priority === "High").length}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">High Priority</div>
                      <div className="text-xs text-gray-500 mt-1">
                        remaining
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-sm font-semibold text-gray-800 mb-3">Progress by Category:</div>
                  <div className="space-y-2">
                    {Array.from(new Set(filteredTests.map((t) => t.category))).map(
                      (category) => {
                        const categoryTests = filteredTests.filter(
                          (t) => t.category === category
                        );
                        const completed = categoryTests.filter(
                          (t) => t.completed
                        ).length;
                        const percentage = categoryTests.length > 0 ? Math.round((completed / categoryTests.length) * 100) : 0;
                        return (
                          <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">{category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {completed}/{categoryTests.length}
                              </span>
                              <span className="text-xs font-medium text-blue-600">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "All" && activeTab !== "Summary" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {filteredTests.filter((t) => t.completed).length}
                    </div>
                    <div className="text-sm text-gray-700 font-medium">Completed</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-500">
                        {filteredTests.filter((t) => !t.completed).length}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Remaining</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-500">
                        {filteredTests.length > 0
                          ? Math.round(
                              (filteredTests.filter((t) => t.completed).length /
                                filteredTests.length) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Progress</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                        {userStats.completed} Completed / {userStats.total} Assigned
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.completed}
                    </div>
                    <div className="text-xs text-gray-500">
                      Completed
                    </div>
                  </div>
                </div>
                <Progress value={userStats.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
