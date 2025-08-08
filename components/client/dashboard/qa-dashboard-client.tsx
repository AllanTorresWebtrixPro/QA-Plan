"use client";

/**
 * QA Dashboard Client Component
 *
 * Client-side component that handles data fetching using React Query and renders the UI.
 * This component maintains the existing UI design while using the new architecture.
 */

import { useState, useRef } from "react";
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
import { TestAssignmentButton } from "@/components/test-assignment-button";
import { Skeleton } from "@/components/ui/skeleton";
import { BasecampCardsDisplay } from "./basecamp-cards-display";
import { useAuth } from "@/components/providers/auth-provider";

// Import separated components
import { DatabaseStatusAlert } from "./dashboard-components/database-status-alert";
import { HeaderSection } from "./dashboard-components/header-section";
import { ProgressSection } from "./dashboard-components/progress-section";
import { ExportButtons } from "./dashboard-components/export-buttons";
import { NavigationTabs } from "./dashboard-components/navigation-tabs";
import { SettingsSecondaryTabs } from "./dashboard-components/settings-secondary-tabs";
import { TestCategoriesSection } from "./dashboard-components/test-categories-section";
import { SidebarSection } from "./dashboard-components/sidebar-section";

// Custom hooks for data fetching
import {
  useUsers,
  useAuthUsers,
  useTestsWithProgress,
  useCurrentUserStats,
  useAllUsersStats,
  useAllAuthUsersStats,
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
  const [activeTab, setActiveTab] = useState("All");
  const [activeSettingsSubsection, setActiveSettingsSubsection] = useState("Access Control");
  const [pendingNoteTestId, setPendingNoteTestId] = useState<string | null>(null);
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>("all");

  // Ref for BasecampCardsDisplay to refresh cards after adding notes
  const basecampCardsRefs = useRef<Record<string, { refreshCards: () => void }>>({});

  // Get authenticated user
  const { user: authUser, profile: authProfile } = useAuth();

  // Data fetching hooks
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: authUsers = [], isLoading: authUsersLoading } = useAuthUsers();
  const { data: dbStatus, isLoading: dbStatusLoading } = useDatabaseStatus();

  // Use authenticated user ID for all operations
  const currentUser = authUser?.id || "";

  // Get current user object for components
  const currentUserObject = authProfile || users.find((user) => user.id === currentUser) || users[0];

  // Create a proper user object for components that expect the User interface
  const displayUser = currentUserObject ? {
    id: currentUserObject.id,
    name: currentUserObject.name,
    avatar: currentUserObject.avatar || currentUserObject.name?.charAt(0)?.toUpperCase() || "U"
  } : undefined;

  // Get current user's test progress for main display
  const { data: testsWithProgress = [], isLoading: testsLoading, refetch } = useTestsWithProgress(currentUser);
  // Get all users' test progress for filtering (without current user's progress)
  const { data: allTestsWithProgress = [], isLoading: allTestsLoading } = useTestsWithProgress("all");
  

  const currentUserStats = useCurrentUserStats(currentUser);
  const allUsersStats = useAllUsersStats();
  const allAuthUsersStats = useAllAuthUsersStats();

  // Mutation hooks
  const toggleTestMutation = useToggleTestCompletion();
  const addNoteMutation = useAddTestNote();
  const exportUserMutation = useExportUserResults();
  const exportAllUsersMutation = useExportAllUsersResults();

  // Handle user filter change
  const handleUserFilterChange = (userId: string) => {
    setSelectedUserFilter(userId);
  };

  // Filter tests based on selected user
  const getFilteredTests = () => {
    if (selectedUserFilter === "all") {
      return testsWithProgress; // Use current user's tests for main display
    }
    // Filter tests assigned to the selected user
    return allTestsWithProgress.filter((test) => test.assignedTo === selectedUserFilter);
  };

  const filteredTests = getFilteredTests();

  // Calculate stats from filtered tests
  const getFilteredStats = () => {
    const completed = finalFilteredTests.filter(test => test.completed).length;
    const total = finalFilteredTests.length;
    const highPriorityRemaining = finalFilteredTests.filter(test => 
      !test.completed && test.priority === "High"
    ).length;
    
    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
      highPriorityRemaining
    };
  };

  // Define disabled Settings subsections
  const disabledSettingsSubsections = [
    "Accessibility Testing",
    "Browser Compatibility", 
    "Performance Testing",
    "Security Testing",
    "Cross-Section Testing"
  ];

  // Map tab names to category names
  const getCategoryFromTab = (tab: string) => {
    const tabToCategoryMap: Record<string, string> = {
      "All": "All",
      "Auth": "Authentication",
      "Invoices": "Invoices",
      "Surveys": "Surveys",
      "On-Site": "On-Site Invoices",
      "Trips": "Current Trips",
      "Prospects": "Prospects",
      "Clients": "Clients",
      "Agents": "Agents",
      "Payments": "Payments",
      "Team": "All", // Team shows all tests
      "Summary": "All", // Summary shows all tests
      "Settings": "Settings" // Settings category
    };
    return tabToCategoryMap[tab] || "All";
  };

  // Apply search and category filters
  const finalFilteredTests = filteredTests.filter((test) => {
    // Exclude tests from disabled Settings subsections
    if (test.category === "Settings" && test.subcategory && disabledSettingsSubsections.includes(test.subcategory)) {
      return false;
    }

    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (activeTab === "Settings") {
      // For Settings, filter by category and subsection
      matchesCategory = test.category === "Settings" && 
        test.subcategory === activeSettingsSubsection;
    } else {
      // For other tabs, use regular category filtering
      const category = getCategoryFromTab(activeTab);
      matchesCategory = category === "All" || test.category === category;
    }
    
    const matchesPriority = selectedPriority === "All" || test.priority === selectedPriority;
    


    return matchesSearch && matchesCategory && matchesPriority;
  });
  




  // Handle test completion toggle
  const handleToggleTest = async (testId: string, completed: boolean) => {
    console.log("handleToggleTest called with:", { testId, completed, currentUser });
    
    if (!currentUser) {
      console.error("No currentUser found");
      return;
    }

    try {
      console.log("Calling toggleTestMutation with:", {
        userId: currentUser,
        testId,
        completed,
      });
      
      await toggleTestMutation.mutateAsync({
        userId: currentUser,
        testId,
        completed,
      });
      
      console.log("toggleTestMutation completed successfully");
    } catch (error) {
      console.error("Error toggling test:", error);
    }
  };

  // Handle adding notes
  const handleAddNote = async (testId: string) => {
    if (!currentUser || !noteInputs[testId]?.trim()) return;

    console.log(`Adding note for test: ${testId}`);
    console.log(`Current user: ${currentUser}`);
    console.log(`Note content: ${noteInputs[testId].trim()}`);

    setPendingNoteTestId(testId);
    
    try {
      await addNoteMutation.mutateAsync({
        userId: currentUser,
        testId,
        notes: noteInputs[testId].trim(),
      });
      setNoteInputs((prev) => ({ ...prev, [testId]: "" }));
      
      // Refresh the Basecamp cards for this test to show the newly created card
      const cardsRef = basecampCardsRefs.current[testId];
      if (cardsRef) {
        cardsRef.refreshCards();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setPendingNoteTestId(null);
    }
  };

  const handleCardAction = async (cardId: string, action: 'accept' | 'reject' | 'delete') => {
    console.log(`Handling ${action} for card ${cardId}`);
    // TODO: Implement Basecamp card action logic
    // This could involve:
    // 1. Moving the card to a different column in Basecamp
    // 2. Updating the card status
    // 3. Adding a comment to the card
    // 4. Notifying relevant team members
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
              users={authUsers}
              selectedUserFilter={selectedUserFilter}
              onUserFilterChange={handleUserFilterChange}
            />

        {/* Progress Section */}
        <ProgressSection
          currentUserObject={selectedUserFilter === "all" ? displayUser : authUsers.find(u => u.id === selectedUserFilter) || displayUser}
          currentUserStats={selectedUserFilter === "all" ? currentUserStats : (() => {
            const authUserStats = allAuthUsersStats.find(stats => stats.user.id === selectedUserFilter);
            if (authUserStats) {
              return {
                completed: authUserStats.completed,
                total: authUserStats.total,
                percentage: authUserStats.percentage,
                highPriorityRemaining: 0 // We'll calculate this if needed
              };
            }
            return currentUserStats;
          })()}
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

        {/* Settings Secondary Tabs */}
        {activeTab === "Settings" && (
          <div className="mt-4">
            <SettingsSecondaryTabs
              activeSubsection={activeSettingsSubsection}
              onSubsectionChange={setActiveSettingsSubsection}
            />
          </div>
        )}

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
              {activeTab === "Settings" && "Settings Testing"}
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
              {activeTab === "Settings" &&
                `Test all settings functionality including ${activeSettingsSubsection.toLowerCase()} management, configuration, and system administration.`}
            </p>
          </div>
        )}

        {/* Team Progress Section */}
        {activeTab === "Team" && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allAuthUsersStats.map((userStats) => (
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
                    <div className="text-2xl font-bold text-green-600">
                      {getFilteredStats().completed}
                    </div>
                    <div className="text-sm text-gray-600">
                      Completed Tests
                    </div>
                    <div className="text-xs text-gray-500">
                      out of {getFilteredStats().total} total tests
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {getFilteredStats().highPriorityRemaining}
                    </div>
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
                      {Array.from(
                        new Set(finalFilteredTests.map((t) => t.category))
                      ).map((category) => {
                        const categoryTests = finalFilteredTests.filter(
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
                      })}
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
                    {finalFilteredTests.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {test.completed ? (
                                <div className="flex items-center gap-1">
                                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleTest(test.id, false)}
                                    disabled={toggleTestMutation.isPending}
                                    className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                                  >
                                    Undo
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleToggleTest(test.id, true)}
                                  disabled={toggleTestMutation.isPending}
                                  className="h-7 px-3 text-xs bg-red-500 hover:bg-red-600 text-white"
                                >
                                  {toggleTestMutation.isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    "Mark as Complete"
                                  )}
                                </Button>
                              )}
                              <h3 className="font-medium">{test.title}</h3>
                              <Badge variant={getPriorityColor(test.priority)}>
                                {test.priority}
                              </Badge>
                              <Badge variant="outline">{test.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {test.expected}
                            </p>
                          </div>
                          <div className="ml-4">
                            <TestAssignmentButton
                              testId={test.id}
                              assignedTo={test.assignedTo}
                              assignedUserName={test.assignedUserName}
                              assignedUserAvatar={test.assignedUserAvatar}
                              assignedUserRole={test.assignedUserRole}
                              completed={test.completed}
                              onAssignmentChange={() => refetch()}
                            />
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

                        {/* Issue Reporting */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Textarea
                              placeholder="Add issue description..."
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
                                pendingNoteTestId === test.id ||
                                !noteInputs[test.id]?.trim()
                              }
                              size="sm"
                            >
                              {pendingNoteTestId === test.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Report Issue"
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Basecamp Cards - Lazy Loaded */}
                        <BasecampCardsDisplay 
                          ref={(ref) => {
                            if (ref) {
                              basecampCardsRefs.current[test.id] = ref;
                            }
                          }}
                          testId={test.id}
                          userId={currentUser}
                          onCardAction={handleCardAction}
                          showOnlyIfCards={false}
                          lazyLoad={false}
                        />


                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <SidebarSection
              currentUserStats={currentUserStats}
              allUsersStats={allAuthUsersStats}
              allTests={testsWithProgress.filter(test => 
                !(test.category === "Settings" && test.subcategory && disabledSettingsSubsections.includes(test.subcategory))
              )}
            />

            {/* Enhanced Test Categories */}
            <TestCategoriesSection
              activeTab={activeTab}
              filteredTests={finalFilteredTests}
              currentUserObject={displayUser}
            />
          </div>
        )}
      </div>
    </>
  );
}
