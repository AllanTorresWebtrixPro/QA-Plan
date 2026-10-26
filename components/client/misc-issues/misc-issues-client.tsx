"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { Plus, Edit, Trash2, Filter, X, ExternalLink } from "lucide-react";
import { MiscIssuesKPICards } from "./misc-issues-kpi-cards";
import { MiscIssuesBasecampCards } from "./misc-issues-basecamp-cards";

interface MiscIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  reported_by: string;
  assigned_to?: string;
  basecamp_card_ids?: string[];
  created_at: string;
  updated_at: string;
  reporter_name?: string;
  reporter_email?: string;
  reporter_avatar?: string;
  assignee_name?: string;
  assignee_email?: string;
  assignee_avatar?: string;
}

export function MiscIssuesClient() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [issues, setIssues] = useState<MiscIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<MiscIssue | null>(null);

  // Ref for MiscIssuesBasecampCards to refresh cards after adding notes
  const basecampCardsRefs = useRef<
    Record<string, { refreshCards: () => void }>
  >({});
  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
    status: "all",
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    priority: "Medium" as "High" | "Medium" | "Low",
  });

  const categories = [
    "General",
    "UI/UX",
    "Performance",
    "Browser Compatibility",
    "Security",
    "Accessibility",
    "Integration",
    "Data",
    "Other",
  ];

  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Open", "In Progress", "Resolved", "Closed"];

  // Calculate KPI metrics
  const kpiMetrics = {
    totalIssues: issues.length,
    openIssues: issues.filter((issue) => issue.status === "Open").length,
    inProgressIssues: issues.filter((issue) => issue.status === "In Progress")
      .length,
    resolvedIssues: issues.filter(
      (issue) => issue.status === "Resolved" || issue.status === "Closed"
    ).length,
    highPriorityIssues: issues.filter((issue) => issue.priority === "High")
      .length,
  };

  // Get all Basecamp card IDs from all misc issues
  const allBasecampCardIds = issues
    .flatMap((issue) => issue.basecamp_card_ids || [])
    .filter((id, index, array) => array.indexOf(id) === index); // Remove duplicates

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "all")
        params.append("category", filters.category);
      if (filters.priority && filters.priority !== "all")
        params.append("priority", filters.priority);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);

      const response = await fetch(`/api/qa/misc-issues?${params}`);
      const result = await response.json();

      if (result.success) {
        setIssues(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch issues",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch issues",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async () => {
    console.log("🚀 handleCreateIssue function called!");
    try {
      console.log("Creating issue with data:", formData);
      console.log("User:", user);
      console.log("Profile:", profile);

      if (!formData.title.trim() || !formData.description.trim()) {
        console.log("❌ Validation failed: Missing title or description");
        toast({
          title: "Error",
          description: "Title and description are required",
          variant: "destructive",
        });
        return;
      }

      console.log("✅ Validation passed, proceeding without authentication...");

      // Use user ID from auth, profile, or fallback to a default user
      let userId = user?.id || profile?.id || "allan-torres"; // Fallback to a default user

      console.log("Using userId:", userId);

      const requestBody = {
        ...formData,
        reportedBy: userId,
      };

      console.log("Sending request:", requestBody);

      // Prepare headers - no authentication required
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      console.log("Sending without Authorization header");

      console.log("🔥 About to make fetch request...");
      const response = await fetch("/api/qa/misc-issues", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("✅ Fetch request completed!");
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response result:", result);

      if (result.success) {
        toast({
          title: "Success",
          description: `Issue created successfully${
            result.basecampCardCreated ? " and Basecamp card created" : ""
          }${
            result.basecampError
              ? ` (Basecamp error: ${result.basecampError})`
              : ""
          }`,
        });
        setIsCreateDialogOpen(false);
        resetForm();
        fetchIssues();
      } else {
        // Handle specific error cases
        let errorMessage = result.error || "Failed to create issue";
        let errorTitle = "Error";

        if (result.error?.includes("Invalid user ID")) {
          errorTitle = "Authentication Error";
          errorMessage =
            "Please log out and log back in to refresh your session.";
        } else if (result.error?.includes("already exists")) {
          errorTitle = "Duplicate Issue";
          errorMessage =
            "An issue with this ID already exists. Please try again.";
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating issue:", error);
      toast({
        title: "Error",
        description: "Failed to create issue",
        variant: "destructive",
      });
    }
  };

  const handleUpdateIssue = async () => {
    try {
      if (!editingIssue) return;

      const response = await fetch("/api/qa/misc-issues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingIssue.id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Issue updated successfully",
        });
        setEditingIssue(null);
        resetForm();
        fetchIssues();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update issue",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    try {
      const response = await fetch(`/api/qa/misc-issues?id=${issueId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Issue deleted successfully",
        });
        fetchIssues();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete issue",
        variant: "destructive",
      });
    }
  };

  // Handle Basecamp card actions (accept, reject, etc.)
  const handleCardAction = async (
    cardId: string,
    action: "accept" | "reject" | "delete"
  ) => {
    try {
      // Find the issue ID from the card ID by looking through all issues
      const issue = issues.find(
        (issue) =>
          issue.basecamp_card_ids && issue.basecamp_card_ids.includes(cardId)
      );

      if (!issue) {
        toast({
          title: "Error",
          description: "Could not find associated issue",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/qa/card-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          action,
          testId: issue.id, // Using testId field for misc issues
          userId: user?.id || profile?.id || "allan-torres",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: `Card ${action}ed successfully`,
        });
        // Refresh the consolidated view
        if (basecampCardsRefs.current["all-misc-issues"]) {
          basecampCardsRefs.current["all-misc-issues"].refreshCards();
        }
        // Refresh the issues list to get updated status
        fetchIssues();
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${action} card`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} card`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "General",
      priority: "Medium",
    });
  };

  const openEditDialog = (issue: MiscIssue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      priority: issue.priority,
    });
  };

  const closeEditDialog = () => {
    setEditingIssue(null);
    resetForm();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (
      filters.category &&
      filters.category !== "all" &&
      issue.category !== filters.category
    )
      return false;
    if (
      filters.priority &&
      filters.priority !== "all" &&
      issue.priority !== filters.priority
    )
      return false;
    if (
      filters.status &&
      filters.status !== "all" &&
      issue.status !== filters.status
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <MiscIssuesKPICards
        totalIssues={kpiMetrics.totalIssues}
        openIssues={kpiMetrics.openIssues}
        inProgressIssues={kpiMetrics.inProgressIssues}
        resolvedIssues={kpiMetrics.resolvedIssues}
        highPriorityIssues={kpiMetrics.highPriorityIssues}
      />

      {/* Header with filters and create button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filters.category !== "all" ||
            filters.priority !== "all" ||
            filters.status !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({ category: "all", priority: "all", status: "all" })
              }
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const response = await fetch("/api/qa/misc-issues/test");
                const result = await response.json();
                console.log("Database test result:", result);
                toast({
                  title: result.success ? "Database OK" : "Database Error",
                  description: result.message || result.error,
                  variant: result.success ? "default" : "destructive",
                });
              } catch (error) {
                console.error("Test failed:", error);
                toast({
                  title: "Test Failed",
                  description: "Could not test database connection",
                  variant: "destructive",
                });
              }
            }}
          >
            Test DB
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report New Issue</DialogTitle>
                <DialogDescription>
                  Report an issue that doesn't fit into any specific test
                  category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Detailed description of the issue..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "High" | "Medium" | "Low") =>
                        setFormData((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateIssue}>Create Issue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Issues</h3>
          <span className="text-sm text-muted-foreground">
            {filteredIssues.length} issue
            {filteredIssues.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No issues found matching your filters.</p>
            <p className="text-sm">
              Try adjusting your filter criteria or create a new issue.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredIssues.map((issue) => (
              <Card
                key={issue.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{issue.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs border ${getPriorityColor(
                            issue.priority
                          )}`}
                        >
                          {issue.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs border ${getStatusColor(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {issue.category}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                        {issue.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Reported by:</span>
                          <span>
                            {issue.reporter_name ||
                              issue.reporter_email ||
                              issue.reported_by}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Created:</span>
                          <span>
                            {new Date(issue.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {issue.assigned_to && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Assigned to:</span>
                            <span>
                              {issue.assignee_name ||
                                issue.assignee_email ||
                                issue.assigned_to}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(issue)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this issue? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteIssue(issue.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Consolidated Basecamp Cards Section */}
      {allBasecampCardIds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Basecamp Cards</h3>
            <span className="text-sm text-muted-foreground">
              {allBasecampCardIds.length} card
              {allBasecampCardIds.length !== 1 ? "s" : ""}
            </span>
          </div>
          <MiscIssuesBasecampCards
            ref={(ref) => {
              if (ref) {
                basecampCardsRefs.current["all-misc-issues"] = ref;
              }
            }}
            userId={user?.id || profile?.id || "allan-torres"}
            onCardAction={handleCardAction}
            showOnlyIfCards={false}
            lazyLoad={false}
          />
        </div>
      )}

      {/* Edit Issue Dialog */}
      <Dialog open={!!editingIssue} onOpenChange={closeEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogDescription>
              Update the issue details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Detailed description of the issue..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "High" | "Medium" | "Low") =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleUpdateIssue}>Update Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
