"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { SurveyTestSummary } from "@/components/survey-test-summary";
import { OnsiteInvoiceTestSummary } from "@/components/onsite-invoice-test-summary";
import { CurrentTripsTestSummary } from "@/components/current-trips-test-summary";
import { Loader2 } from "lucide-react";

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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "Medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateCategoryStats = (tests: Test[], category: string) => {
    const categoryTests = tests.filter((test) => test.category === category);
    const completed = categoryTests.filter((test) => test.completed).length;
    const total = categoryTests.length;
    const highPriority = categoryTests.filter(
      (test) => test.priority === "High"
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, highPriority, percentage };
  };

  const calculateSubcategoryStats = (tests: Test[], subcategory: string) => {
    const subcategoryTests = tests.filter((test) =>
      test.title.toLowerCase().includes(subcategory.toLowerCase())
    );
    const completed = subcategoryTests.filter((test) => test.completed).length;
    const total = subcategoryTests.length;
    const highPriority = subcategoryTests.filter(
      (test) => test.priority === "High"
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, highPriority, percentage };
  };

  const calculatePriorityStats = (tests: Test[]) => {
    const highPriorityTests = tests.filter((test) => test.priority === "High");
    const mediumPriorityTests = tests.filter(
      (test) => test.priority === "Medium"
    );
    const lowPriorityTests = tests.filter((test) => test.priority === "Low");

    const highCompleted = highPriorityTests.filter(
      (test) => test.completed
    ).length;
    const mediumCompleted = mediumPriorityTests.filter(
      (test) => test.completed
    ).length;
    const lowCompleted = lowPriorityTests.filter(
      (test) => test.completed
    ).length;

    return {
      high: { completed: highCompleted, total: highPriorityTests.length },
      medium: { completed: mediumCompleted, total: mediumPriorityTests.length },
      low: { completed: lowCompleted, total: lowPriorityTests.length },
    };
  };

  const calculateOverallStats = (tests: Test[]) => {
    const completed = tests.filter((test) => test.completed).length;
    const total = tests.length;
    const highPriorityRemaining = tests.filter(
      (test) => !test.completed && test.priority === "High"
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, highPriorityRemaining, percentage };
  };

  // Calculate real statistics
  const surveyStats = calculateCategoryStats(filteredTests, "Surveys");
  const onsiteStats = calculateCategoryStats(filteredTests, "On-Site Invoices");
  const tripsStats = calculateCategoryStats(filteredTests, "Current Trips");
  const overallStats = calculateOverallStats(filteredTests);

  // Calculate subcategory stats for survey tests
  const dashboardOverviewStats = calculateSubcategoryStats(
    filteredTests,
    "Dashboard"
  );
  const surveyManagementStats = calculateSubcategoryStats(
    filteredTests,
    "Survey Management"
  );
  const sectionManagementStats = calculateSubcategoryStats(
    filteredTests,
    "Section"
  );

  const priorityStats = calculatePriorityStats(filteredTests);

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
          <Tabs defaultValue="survey" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="survey">Survey</TabsTrigger>
              <TabsTrigger value="onsite">Onsite</TabsTrigger>
              <TabsTrigger value="trips">Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="survey" className="space-y-4">
              {currentUserObject ? (
                <>
                  {/* Survey Overview Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">
                        Survey Testing Overview - {currentUserObject.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {surveyStats.completed}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {surveyStats.total - surveyStats.completed}
                        </div>
                        <div className="text-sm text-gray-600">Remaining</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {surveyStats.percentage}%
                        </div>
                        <div className="text-sm text-gray-600">Progress</div>
                      </div>
                    </div>
                    <Progress
                      value={surveyStats.percentage}
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        Survey Tests: {surveyStats.completed}/
                        {surveyStats.total}
                      </span>
                      <span>
                        High Priority: {surveyStats.highPriority}/
                        {surveyStats.total}
                      </span>
                    </div>
                  </div>

                  {/* Category Breakdown Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Dashboard & Overview</h4>
                          <Badge variant="secondary" className="text-xs">
                            {dashboardOverviewStats.percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>
                            {dashboardOverviewStats.completed}/
                            {dashboardOverviewStats.total} tests completed
                          </span>
                          <span>
                            {dashboardOverviewStats.highPriority} high priority
                          </span>
                        </div>
                        <Progress
                          value={dashboardOverviewStats.percentage}
                          className="h-1"
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Survey Management</h4>
                          <Badge variant="secondary" className="text-xs">
                            {surveyManagementStats.percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>
                            {surveyManagementStats.completed}/
                            {surveyManagementStats.total} tests completed
                          </span>
                          <span>
                            {surveyManagementStats.highPriority} high priority
                          </span>
                        </div>
                        <Progress
                          value={surveyManagementStats.percentage}
                          className="h-1"
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Section Management</h4>
                          <Badge variant="secondary" className="text-xs">
                            {sectionManagementStats.percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>
                            {sectionManagementStats.completed}/
                            {sectionManagementStats.total} tests completed
                          </span>
                          <span>
                            {sectionManagementStats.highPriority} high priority
                          </span>
                        </div>
                        <Progress
                          value={sectionManagementStats.percentage}
                          className="h-1"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Priority Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Priority Test Summary</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon("High")}
                          <Badge variant="destructive" className="text-xs">
                            High
                          </Badge>
                        </div>
                        <span className="text-sm">
                          {priorityStats.high.completed}/
                          {priorityStats.high.total} tests
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon("Medium")}
                          <Badge variant="default" className="text-xs">
                            Medium
                          </Badge>
                        </div>
                        <span className="text-sm">
                          {priorityStats.medium.completed}/
                          {priorityStats.medium.total} tests
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon("Low")}
                          <Badge variant="secondary" className="text-xs">
                            Low
                          </Badge>
                        </div>
                        <span className="text-sm">
                          {priorityStats.low.completed}/
                          {priorityStats.low.total} tests
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading user data...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="onsite">
              {currentUserObject ? (
                <OnsiteInvoiceTestSummary
                  tests={filteredTests}
                  currentUser={currentUserObject}
                />
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading user data...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trips">
              {currentUserObject ? (
                <CurrentTripsTestSummary
                  tests={filteredTests}
                  currentUser={currentUserObject}
                />
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading user data...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {activeTab === "Summary" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {overallStats.completed}
              </div>
              <div className="text-sm text-gray-600">My Completed Tests</div>
              <div className="text-xs text-gray-500">
                out of {overallStats.total} total tests
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {overallStats.highPriorityRemaining}
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
