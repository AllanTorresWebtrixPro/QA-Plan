"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

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

interface TestCategoriesSectionProps {
  activeTab: string;
  filteredTests: Test[];
  currentUserObject: User | undefined;
}

export function TestCategoriesSection({
  activeTab,
  filteredTests,
  currentUserObject,
}: TestCategoriesSectionProps) {




  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {activeTab === "All" && "Test Categories"}
          {activeTab === "Summary" && "Progress by Category"}
          {activeTab !== "All" &&
            activeTab !== "Summary" &&
            `${activeTab} Test Categories`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTab === "All" && (
          <div className="text-center py-8">
            <div className="text-2xl font-bold text-blue-600">
              {filteredTests.filter((t) => t.completed).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredTests.filter((t) => !t.completed).length}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredTests.length > 0
                  ? Math.round(
                      (filteredTests.filter((t) => t.completed).length /
                        filteredTests.length) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        )}

        {activeTab === "Summary" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredTests.filter((t) => t.completed).length}
              </div>
              <div className="text-sm text-gray-600">My Completed Tests</div>
              <div className="text-xs text-gray-500">
                out of {filteredTests.length} total tests
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredTests.filter((t) => !t.completed && t.priority === "High").length}
              </div>
              <div className="text-sm text-gray-600">
                High Priority Remaining
              </div>
              <div className="text-xs text-gray-500">
                high priority tests pending
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Progress by Category:</div>
              <div className="space-y-1 text-xs">
                {Array.from(new Set(filteredTests.map((t) => t.category))).map(
                  (category) => {
                    const categoryTests = filteredTests.filter(
                      (t) => t.category === category
                    );
                    const completed = categoryTests.filter(
                      (t) => t.completed
                    ).length;
                    return (
                      <div key={category} className="flex justify-between">
                        <span>{category}</span>
                        <span>
                          {completed}/{categoryTests.length}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab !== "All" && activeTab !== "Summary" && (
          <div className="text-center py-8">
            <div className="text-2xl font-bold text-blue-600">
              {filteredTests.filter((t) => t.completed).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredTests.filter((t) => !t.completed).length}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredTests.length > 0
                  ? Math.round(
                      (filteredTests.filter((t) => t.completed).length /
                        filteredTests.length) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
