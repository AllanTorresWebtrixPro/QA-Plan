"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useAllUsersStats,
  useAllAuthUsersStats,
  useTestsWithProgress,
  useExportAllUsersResults,
} from "@/hooks/use-qa-queries";

export function ReportsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Data fetching
  const allUsersStats = useAllUsersStats();
  const allAuthUsersStats = useAllAuthUsersStats();
  const { data: testsWithProgress = [], isLoading } = useTestsWithProgress("user-1");
  const exportAllUsersMutation = useExportAllUsersResults();

  // Filter data based on selected period and category
  const filteredTests = testsWithProgress.filter(
    (test: any) =>
      selectedCategory === "All" || test.category === selectedCategory
  );

  // Calculate statistics
  const totalTests = filteredTests.length;
  const completedTests = filteredTests.filter((t: any) => t.completed).length;
  const highPriorityTests = filteredTests.filter(
    (t: any) => t.priority === "High"
  ).length;
  const completedHighPriority = filteredTests.filter(
    (t: any) => t.priority === "High" && t.completed
  ).length;
  const averageProgress =
    allUsersStats.length > 0
      ? allUsersStats.reduce(
          (sum: number, stats: any) => sum + stats.percentage,
          0
        ) / allUsersStats.length
      : 0;

  // Category breakdown
  const categoryStats = filteredTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = { total: 0, completed: 0 };
    }
    acc[test.category].total++;
    if (test.completed) acc[test.category].completed++;
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // Priority breakdown
  const priorityStats = filteredTests.reduce((acc, test) => {
    if (!acc[test.priority]) {
      acc[test.priority] = { total: 0, completed: 0 };
    }
    acc[test.priority].total++;
    if (test.completed) acc[test.priority].completed++;
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // User performance ranking
  const userRanking = [...allAuthUsersStats]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // Handle export
  const handleExportReport = async () => {
    try {
      const data = await exportAllUsersMutation.mutateAsync();
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qa-report-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  if (isLoading || allAuthUsersStats.length === 0 || testsWithProgress.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Report Filters</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleExportReport}
                disabled={exportAllUsersMutation.isPending}
              >
                {exportAllUsersMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Time Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Surveys">Surveys</SelectItem>
                  <SelectItem value="On-Site Invoices">
                    On-Site Invoices
                  </SelectItem>
                  <SelectItem value="Current Trips">Current Trips</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Report Type
              </label>
              <Select defaultValue="summary">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Report</SelectItem>
                  <SelectItem value="comparison">Comparison Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalTests > 0
                ? Math.round((completedTests / totalTests) * 100)
                : 0}
              %
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {highPriorityTests}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-600">
                {completedHighPriority} completed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Average</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(averageProgress)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="priorities">Priorities</TabsTrigger>
          <TabsTrigger value="users">User Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>
                        {totalTests > 0
                          ? Math.round((completedTests / totalTests) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        totalTests > 0 ? (completedTests / totalTests) * 100 : 0
                      }
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {completedTests}
                      </div>
                      <div className="text-sm text-green-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {totalTests - completedTests}
                      </div>
                      <div className="text-sm text-orange-600">Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userRanking.slice(0, 3).map((userStats, index) => (
                    <div
                      key={userStats.user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <span className="font-medium">
                          {userStats.user.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {userStats.percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {userStats.completed}/{userStats.total} tests
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Tests</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(categoryStats).map(([category, stats]) => {
                    const progress =
                      stats.total > 0
                        ? (stats.completed / stats.total) * 100
                        : 0;
                    return (
                      <TableRow key={category}>
                        <TableCell className="font-medium">
                          {category}
                        </TableCell>
                        <TableCell>{stats.total}</TableCell>
                        <TableCell>{stats.completed}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2 w-20" />
                            <span className="text-sm">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              progress >= 80
                                ? "default"
                                : progress >= 50
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {progress >= 80
                              ? "Excellent"
                              : progress >= 50
                              ? "Good"
                              : "Needs Attention"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priorities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Priority Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(priorityStats).map(([priority, stats]) => {
                  const progress =
                    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                  const getPriorityColor = (priority: string) => {
                    switch (priority) {
                      case "High":
                        return "text-red-600";
                      case "Medium":
                        return "text-yellow-600";
                      case "Low":
                        return "text-green-600";
                      default:
                        return "text-gray-600";
                    }
                  };

                  return (
                    <Card key={priority} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`font-semibold ${getPriorityColor(
                            priority
                          )}`}
                        >
                          {priority} Priority
                        </h4>
                        <Badge variant="outline">{stats.total}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completed</span>
                          <span>{stats.completed}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-center text-sm font-medium">
                          {progress.toFixed(1)}%
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Performance Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRanking.map((userStats, index) => (
                    <TableRow key={userStats.user.id}>
                      <TableCell>
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {userStats.user.name}
                      </TableCell>
                      <TableCell>{userStats.user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={userStats.percentage}
                            className="h-2 w-20"
                          />
                          <span className="text-sm">
                            {userStats.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {userStats.completed}/{userStats.total}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            userStats.percentage >= 80
                              ? "default"
                              : userStats.percentage >= 50
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {userStats.percentage >= 80
                            ? "High Performer"
                            : userStats.percentage >= 50
                            ? "Active"
                            : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
