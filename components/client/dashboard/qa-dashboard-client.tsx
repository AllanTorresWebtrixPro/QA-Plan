"use client";

/**
 * QA Dashboard Client Component
 *
 * Client-side component that handles data fetching using React Query and renders the UI.
 * This component maintains the existing UI design while using the new architecture.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  User,
  Loader2,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SurveyTestSummary } from "@/components/survey-test-summary";
import { OnsiteInvoiceTestSummary } from "@/components/onsite-invoice-test-summary";
import { CurrentTripsTestSummary } from "@/components/current-trips-test-summary";
import { Skeleton } from "@/components/ui/skeleton";

// Import separated components
import { DatabaseStatusAlert } from "./dashboard-components/database-status-alert";
import { HeaderSection } from "./dashboard-components/header-section";
import { ProgressSection } from "./dashboard-components/progress-section";
import { ExportButtons } from "./dashboard-components/export-buttons";
import { NavigationTabs } from "./dashboard-components/navigation-tabs";

// Custom hooks for data fetching
import {
  useUsers,
  useTestsWithProgress,
  useCurrentUserStats,
  useAllUsersStats,
  useDatabaseStatus,
  useToggleTestCompletion,
  useAddTestNote,
  useExportUserResults,
  useExportAllUsersResults,
} from "@/hooks/use-qa-queries";

/**
 * Loading component for individual sections
 */
function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

/**
 * Main QA Dashboard Client Component
 *
 * This component:
 * - Uses React Query hooks for data fetching
 * - Maintains the existing UI design
 * - Handles user interactions and state management
 * - Provides loading and error states
 */
export function QADashboardClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<string>("");
  const [activeTab, setActiveTab] = useState("All");

  // Data fetching hooks
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: dbStatus, isLoading: dbStatusLoading } = useDatabaseStatus();

  // Set current user to first user if not set
  if (users.length > 0 && !currentUser) {
    setCurrentUser(users[0].id);
  }

  // Get current user object for components
  const currentUserObject =
    users.find((user) => user.id === currentUser) || users[0];

  const testsWithProgress = useTestsWithProgress(currentUser);
  const currentUserStats = useCurrentUserStats(currentUser);
  const allUsersStats = useAllUsersStats();

  // Mutation hooks
  const toggleTestMutation = useToggleTestCompletion();
  const addNoteMutation = useAddTestNote();
  const exportUserMutation = useExportUserResults();
  const exportAllUsersMutation = useExportAllUsersResults();

  // Filter tests based on search, filters, and active tab
  const filteredTests = testsWithProgress.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || test.category === selectedCategory;
    const matchesPriority =
      selectedPriority === "All" || test.priority === selectedPriority;

    // Filter by active tab
    let matchesTab = true;
    if (activeTab !== "All") {
      const categoryMapping: Record<string, string[]> = {
        Auth: ["Authentication"],
        Invoices: ["Invoices"],
        Surveys: ["Surveys"],
        "On-Site": ["On-Site Invoices"],
        Trips: ["Current Trips"],
        Prospects: ["Prospects"],
        Clients: ["Clients"],
        Agents: ["Agents"],
        Payments: ["Payments"],
        Team: ["Team"],
        Summary: ["Summary"],
      };

      const allowedCategories = categoryMapping[activeTab] || [];
      matchesTab = allowedCategories.includes(test.category);
    }

    return matchesSearch && matchesCategory && matchesPriority && matchesTab;
  });

  // Handle test completion toggle
  const handleToggleTest = async (testId: string, completed: boolean) => {
    if (!currentUser) return;

    try {
      await toggleTestMutation.mutateAsync({
        userId: currentUser,
        testId,
        completed,
      });
    } catch (error) {
      console.error("Error toggling test:", error);
    }
  };

  // Handle adding notes
  const handleAddNote = async (testId: string) => {
    if (!currentUser || !noteInputs[testId]?.trim()) return;

    try {
      await addNoteMutation.mutateAsync({
        userId: currentUser,
        testId,
        notes: noteInputs[testId].trim(),
      });
      setNoteInputs((prev) => ({ ...prev, [testId]: "" }));
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Handle user switching
  const switchUser = (userId: string) => {
    setCurrentUser(userId);
  };

  // Handle exports
  const handleExportUser = async () => {
    if (!currentUser) return;

    try {
      const data = await exportUserMutation.mutateAsync(currentUser);
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qa-results-${currentUser}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting user results:", error);
    }
  };

  const handleExportAllUsers = async () => {
    try {
      const data = await exportAllUsersMutation.mutateAsync();
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qa-results-all-users.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting all users results:", error);
    }
  };

  // Get priority color
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

  // Loading state
  if (usersLoading || dbStatusLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading QA Plan from Database...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          scroll-snap-type: x mandatory;
        }
        .scrollbar-hide > * {
          scroll-snap-align: start;
        }
      `}</style>
      <div className="space-y-6">
        {/* Database Status Alert */}
        <DatabaseStatusAlert dbStatus={dbStatus} />

        {/* Header Section */}
        <HeaderSection
          users={users}
          currentUser={currentUser}
          onUserSwitch={switchUser}
        />

        {/* Progress Section */}
        <ProgressSection
          currentUserObject={currentUserObject}
          currentUserStats={currentUserStats}
        />

        {/* Export Buttons */}
        <ExportButtons
          onExportUser={handleExportUser}
          onExportAllUsers={handleExportAllUsers}
          isExportUserPending={exportUserMutation.isPending}
          isExportAllUsersPending={exportAllUsersMutation.isPending}
        />

        {/* Navigation Tabs */}
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab !== "All" && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === "Auth" && "Authentication Testing"}
              {activeTab === "Invoices" && "Invoice Testing"}
              {activeTab === "Surveys" && "Survey Testing"}
              {activeTab === "On-Site" && "On-Site Invoice Testing"}
              {activeTab === "Trips" && "Current Trips Testing"}
              {activeTab === "Prospects" && "Prospects Testing"}
              {activeTab === "Clients" && "Client Management Testing"}
              {activeTab === "Agents" && "Agent Management Testing"}
              {activeTab === "Payments" && "Payment Processing Testing"}
              {activeTab === "Team" && "Team Progress Overview"}
              {activeTab === "Summary" && "QA Testing Summary"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {activeTab === "Auth" &&
                "Test all authentication-related functionality including login, logout, password reset, and session management."}
              {activeTab === "Invoices" &&
                "Test invoice management functionality including creation, editing, payment processing, and reporting."}
              {activeTab === "Surveys" &&
                "Test survey functionality including creation, distribution, and response collection."}
              {activeTab === "On-Site" &&
                "Test on-site invoice functionality including mobile payments and field operations."}
              {activeTab === "Trips" &&
                "Test trip management functionality including scheduling, tracking, and reporting."}
              {activeTab === "Prospects" &&
                "Test prospect management functionality including creation, status updates, and conversion tracking."}
              {activeTab === "Clients" &&
                "Test client management functionality including profile management, communication history, and relationship tracking."}
              {activeTab === "Agents" &&
                "Test agent management functionality including profile management, commission tracking, and performance monitoring."}
              {activeTab === "Payments" &&
                "Test payment processing functionality including payment methods, reconciliation, and reporting."}
              {activeTab === "Team" &&
                "Track team progress and performance across all test categories."}
              {activeTab === "Summary" &&
                "Overview of all testing progress and key metrics."}
            </p>
          </div>
        )}

        {/* Team Progress Section */}
        {activeTab === "Team" && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allUsersStats.map((userStats) => (
                <Card key={userStats.user.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">
                          {userStats.user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{userStats.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {userStats.completed}/{userStats.total} (
                          {userStats.percentage.toFixed(0)}%)
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={userStats.percentage}
                      className="h-2 mb-3"
                    />
                    <Button variant="outline" size="sm" className="w-full">
                      Export
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Summary Cards Section */}
        {activeTab === "Summary" && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">
                      My Completed Tests
                    </div>
                    <div className="text-xs text-gray-500">
                      out of 132 total tests
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">65</div>
                    <div className="text-sm text-gray-600">
                      High Priority Remaining
                    </div>
                    <div className="text-xs text-gray-500">
                      high priority tests pending
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      Progress by Category:
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Accessibility</span>
                        <span>0/2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Agents</span>
                        <span>0/2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Authentication</span>
                        <span>0/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clients</span>
                        <span>0/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Trips</span>
                        <span>0/30</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Main Content */}
        {activeTab !== "Team" && activeTab !== "Summary" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tests List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Test Cases</span>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search tests..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTests.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Checkbox
                                checked={test.completed}
                                onCheckedChange={(checked) =>
                                  handleToggleTest(test.id, checked as boolean)
                                }
                                disabled={toggleTestMutation.isPending}
                              />
                              <h3 className="font-medium">{test.title}</h3>
                              <Badge variant={getPriorityColor(test.priority)}>
                                {test.priority}
                              </Badge>
                              <Badge variant="outline">{test.category}</Badge>
                              {test.completed && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {test.expected}
                            </p>
                          </div>
                        </div>

                        {/* Test Steps */}
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Steps:</h4>
                          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                            {test.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Edge Cases */}
                        {test.edgeCases.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-1">
                              Edge Cases:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {test.edgeCases.map((edgeCase, index) => (
                                <li key={index}>{edgeCase}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Textarea
                              placeholder="Add notes..."
                              value={noteInputs[test.id] || ""}
                              onChange={(e) =>
                                setNoteInputs((prev) => ({
                                  ...prev,
                                  [test.id]: e.target.value,
                                }))
                              }
                              className="flex-1"
                              rows={2}
                            />
                            <Button
                              onClick={() => handleAddNote(test.id)}
                              disabled={
                                addNoteMutation.isPending ||
                                !noteInputs[test.id]?.trim()
                              }
                              size="sm"
                            >
                              {addNoteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Add Note"
                              )}
                            </Button>
                          </div>
                          {test.notes && (
                            <div className="bg-gray-50 p-2 rounded text-sm">
                              <strong>Notes:</strong> {test.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Progress Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {currentUserStats.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Completion Rate
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          {currentUserStats.completed}
                        </div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-red-600">
                          {currentUserStats.highPriorityRemaining}
                        </div>
                        <div className="text-xs text-gray-600">
                          High Priority Remaining
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All Users Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>All Users Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allUsersStats.map((userStats) => (
                      <div
                        key={userStats.user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {userStats.user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {userStats.user.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {userStats.completed}/{userStats.total}
                          </div>
                          <div className="text-xs text-gray-600">
                            {userStats.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Test Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>
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
                      <TabsContent value="survey">
                        {currentUserObject ? (
                          <SurveyTestSummary
                            tests={filteredTests}
                            currentUser={currentUserObject}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p className="text-gray-600">
                              Loading user data...
                            </p>
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
                            <p className="text-gray-600">
                              Loading user data...
                            </p>
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
                            <p className="text-gray-600">
                              Loading user data...
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                  {activeTab === "Summary" && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          0
                        </div>
                        <div className="text-sm text-gray-600">
                          My Completed Tests
                        </div>
                        <div className="text-xs text-gray-500">
                          out of 132 total tests
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          65
                        </div>
                        <div className="text-sm text-gray-600">
                          High Priority Remaining
                        </div>
                        <div className="text-xs text-gray-500">
                          high priority tests pending
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          Progress by Category:
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Accessibility</span>
                            <span>0/2</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Agents</span>
                            <span>0/2</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Authentication</span>
                            <span>0/3</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clients</span>
                            <span>0/3</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Trips</span>
                            <span>0/30</span>
                          </div>
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
                                (filteredTests.filter((t) => t.completed)
                                  .length /
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
            </div>
          </div>
        )}
      </div>
    </>
  );
}
