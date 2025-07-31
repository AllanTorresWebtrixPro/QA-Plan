"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Eye,
  Edit,
  Plus,
  Loader2,
} from "lucide-react";
import {
  useTestsWithProgress,
  useToggleTestCompletion,
  useAddTestNote,
} from "@/hooks/use-qa-queries";

export function TestCasesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState("user-1"); // Default user

  // Data fetching
  const { data: testsWithProgress = [], isLoading } =
    useTestsWithProgress(currentUser);
  const toggleTestMutation = useToggleTestCompletion();
  const addNoteMutation = useAddTestNote();

  // Filter tests
  const filteredTests = testsWithProgress.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.expected.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || test.category === selectedCategory;
    const matchesPriority =
      selectedPriority === "All" || test.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Completed" && test.completed) ||
      (selectedStatus === "Pending" && !test.completed);

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Get unique categories and priorities
  const categories = [
    "All",
    ...Array.from(new Set(testsWithProgress.map((t) => t.category))),
  ];
  const priorities = ["All", "High", "Medium", "Low"];
  const statuses = ["All", "Completed", "Pending"];

  // Statistics
  const totalTests = testsWithProgress.length;
  const completedTests = testsWithProgress.filter((t) => t.completed).length;
  const highPriorityTests = testsWithProgress.filter(
    (t) => t.priority === "High"
  ).length;
  const completedHighPriority = testsWithProgress.filter(
    (t) => t.priority === "High" && t.completed
  ).length;

  // Handle test completion toggle
  const handleToggleTest = async (testId: string, completed: boolean) => {
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
    if (!noteInputs[testId]?.trim()) return;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading test cases...</span>
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
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">All test cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedTests}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalTests > 0
                ? Math.round((completedTests / totalTests) * 100)
                : 0}
              % completion rate
            </p>
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
            <p className="text-xs text-muted-foreground">
              {completedHighPriority} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalTests - completedTests}
            </div>
            <p className="text-xs text-muted-foreground">Remaining tests</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters & Search</span>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Test Case
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
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
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={test.completed}
                      onCheckedChange={(checked) =>
                        handleToggleTest(test.id, checked as boolean)
                      }
                      disabled={toggleTestMutation.isPending}
                    />
                    <Badge variant={getPriorityColor(test.priority)}>
                      {test.priority}
                    </Badge>
                    <Badge variant="outline">{test.category}</Badge>
                    {test.completed && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{test.title}</DialogTitle>
                      <DialogDescription>
                        Detailed view of test case {test.id}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Expected Result:</h4>
                        <p className="text-sm text-muted-foreground">
                          {test.expected}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Steps:</h4>
                        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                          {test.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {test.edgeCases.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Edge Cases:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {test.edgeCases.map((edgeCase, index) => (
                              <li key={index}>{edgeCase}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-2">Notes:</h4>
                        <div className="flex gap-2">
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
                              "Add"
                            )}
                          </Button>
                        </div>
                        {test.notes && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>Current Notes:</strong> {test.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {test.expected}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>ID: {test.id}</span>
                <span>{test.steps.length} steps</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No test cases found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
