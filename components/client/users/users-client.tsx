"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  Users,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  BarChart3,
  Loader2,
  Plus,
  Filter,
} from "lucide-react";
import {
  useUsers,
  useAllUsersStats,
  useExportUserResults,
  useExportAllUsersResults,
} from "@/hooks/use-qa-queries";

export function UsersClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Data fetching
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: allUsersStats = [], isLoading: statsLoading } =
    useAllUsersStats();
  const exportUserMutation = useExportUserResults();
  const exportAllUsersMutation = useExportAllUsersResults();

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    const userStats = allUsersStats.find((stats) => stats.user.id === user.id);
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "High Performer" &&
        userStats &&
        userStats.percentage >= 80) ||
      (selectedStatus === "Active" &&
        userStats &&
        userStats.percentage >= 50) ||
      (selectedStatus === "Needs Attention" &&
        userStats &&
        userStats.percentage < 50);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get unique roles
  const roles = ["All", ...Array.from(new Set(users.map((u) => u.role)))];
  const statuses = ["All", "High Performer", "Active", "Needs Attention"];

  // Overall statistics
  const totalUsers = users.length;
  const activeUsers = allUsersStats.filter(
    (stats) => stats.percentage > 0
  ).length;
  const highPerformers = allUsersStats.filter(
    (stats) => stats.percentage >= 80
  ).length;
  const averageProgress =
    allUsersStats.length > 0
      ? allUsersStats.reduce((sum, stats) => sum + stats.percentage, 0) /
        allUsersStats.length
      : 0;

  // Handle exports
  const handleExportUser = async (userId: string) => {
    try {
      const data = await exportUserMutation.mutateAsync(userId);
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qa-results-${userId}.csv`;
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

  // Get status badge variant
  const getStatusBadge = (percentage: number) => {
    if (percentage >= 80) return "default";
    if (percentage >= 50) return "secondary";
    return "destructive";
  };

  // Get status text
  const getStatusText = (percentage: number) => {
    if (percentage >= 80) return "High Performer";
    if (percentage >= 50) return "Active";
    return "Needs Attention";
  };

  if (usersLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0
                ? Math.round((activeUsers / totalUsers) * 100)
                : 0}
              % engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Performers
            </CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {highPerformers}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0
                ? Math.round((highPerformers / totalUsers) * 100)
                : 0}
              % of team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(averageProgress)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Team average completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters & Actions</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleExportAllUsers}
                disabled={exportAllUsersMutation.isPending}
              >
                {exportAllUsersMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const userStats = allUsersStats.find(
            (stats) => stats.user.id === user.id
          );

          return (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-sm">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>User Details - {user.name}</DialogTitle>
                        <DialogDescription>
                          Detailed view of user progress and performance.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {user.name}
                            </h3>
                            <p className="text-muted-foreground">{user.role}</p>
                            <Badge
                              variant={
                                userStats
                                  ? getStatusBadge(userStats.percentage)
                                  : "secondary"
                              }
                            >
                              {userStats
                                ? getStatusText(userStats.percentage)
                                : "No Data"}
                            </Badge>
                          </div>
                        </div>

                        {userStats && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {userStats.completed}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Completed
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {userStats.total}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Total Tests
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Progress</span>
                                <span>{userStats.percentage.toFixed(1)}%</span>
                              </div>
                              <Progress
                                value={userStats.percentage}
                                className="h-2"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportUser(user.id)}
                            disabled={exportUserMutation.isPending}
                          >
                            {exportUserMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                            Export Results
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4" />
                            View Analytics
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {userStats ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{userStats.percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={userStats.percentage} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {userStats.completed}/{userStats.total} tests
                      </span>
                      <Badge variant={getStatusBadge(userStats.percentage)}>
                        {getStatusText(userStats.percentage)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No progress data
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const userStats = allUsersStats.find(
                  (stats) => stats.user.id === user.id
                );

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {userStats ? (
                        <div className="flex items-center gap-2">
                          <Progress
                            value={userStats.percentage}
                            className="h-2 w-20"
                          />
                          <span className="text-sm">
                            {userStats.percentage.toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No data</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {userStats ? (
                        <span className="font-medium">
                          {userStats.completed}/{userStats.total}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {userStats && (
                        <Badge variant={getStatusBadge(userStats.percentage)}>
                          {getStatusText(userStats.percentage)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
