"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, CheckCircle, Circle, Clock, User, X } from "lucide-react";
import { BasecampCards } from "./basecamp-cards";
import { TestBasecampCards } from "./test-basecamp-cards";
import { TestDisableButton } from "@/components/test-disable-button";
import { useAuth } from "@/components/providers/auth-provider";
import { isAdmin } from "@/lib/utils";

interface TestItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  priority: "High" | "Medium" | "Low";
  steps: string[];
  expected: string;
  edgeCases: string[];
  completed?: boolean;
  completedAt?: string;
  notes?: string;
  disabled?: boolean;
  assignedTo?: string;
  assignedAt?: string;
  assignedBy?: string;
  assignedUserName?: string;
  assignedUserAvatar?: string;
  assignedUserRole?: string;
  assignedByName?: string;
}

export function TestCasesClient() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSubcategory, setFilterSubcategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterAssignment, setFilterAssignment] = useState<string>("all");
  const { profile } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/qa/tests");
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setTests(data);
        } else {
          console.error("Failed to fetch tests:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) => {
    const categoryMatch = filterCategory === "all" || test.category === filterCategory;
    const subcategoryMatch = filterSubcategory === "all" || test.subcategory === filterSubcategory;
    const priorityMatch = filterPriority === "all" || test.priority === filterPriority;
    
    // Assignment filter
    let assignmentMatch = true;
    if (filterAssignment === "assigned") {
      assignmentMatch = !!test.assignedTo;
    } else if (filterAssignment === "unassigned") {
      assignmentMatch = !test.assignedTo;
    }
    
    // Filter out disabled tests for non-admin users
    if (!isAdmin(profile) && test.disabled) {
      return false;
    }
    
    return categoryMatch && subcategoryMatch && priorityMatch && assignmentMatch;
  });

  const categories = Array.from(new Set(tests.map((test) => test.category)));
  const subcategories = Array.from(new Set(
    tests
      .filter(test => test.subcategory)
      .map((test) => test.subcategory!)
  ));
  const priorities = ["High", "Medium", "Low"];

  // Get available subcategories for the selected category
  const availableSubcategories = filterCategory === "all" 
    ? subcategories
    : Array.from(new Set(
        tests
          .filter(test => test.category === filterCategory && test.subcategory)
          .map((test) => test.subcategory!)
      ));

  // Reset subcategory filter when category changes
  useEffect(() => {
    if (filterCategory === "all" || !availableSubcategories.includes(filterSubcategory)) {
      setFilterSubcategory("all");
    }
  }, [filterCategory, filterSubcategory, availableSubcategories]);

  const clearAllFilters = () => {
    setFilterCategory("all");
    setFilterSubcategory("all");
    setFilterPriority("all");
    setFilterAssignment("all");
  };

  const hasActiveFilters = filterCategory !== "all" || 
                          filterSubcategory !== "all" || 
                          filterPriority !== "all" || 
                          filterAssignment !== "all";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Test Basecamp Cards Component */}
      <TestBasecampCards />
      
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Test Cases</h2>
          <p className="text-muted-foreground">
            {filteredTests.length} of {tests.length} tests
            {hasActiveFilters && (
              <span className="ml-2 text-sm text-blue-600">
                (filtered)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Subcategory</label>
                <select
                  value={filterSubcategory}
                  onChange={(e) => setFilterSubcategory(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                  disabled={availableSubcategories.length === 0}
                >
                  <option value="all">All Subcategories</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="all">All Priorities</option>
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Assignment</label>
                <select
                  value={filterAssignment}
                  onChange={(e) => setFilterAssignment(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="all">All Tests</option>
                  <option value="assigned">Assigned</option>
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filterCategory !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Category: {filterCategory}
            </Badge>
          )}
          {filterSubcategory !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Subcategory: {filterSubcategory}
            </Badge>
          )}
          {filterPriority !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Priority: {filterPriority}
            </Badge>
          )}
          {filterAssignment !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {filterAssignment === "assigned" ? "Assigned" : "Unassigned"}
            </Badge>
          )}
        </div>
      )}

      {/* Test cases grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{test.category}</Badge>
                    {test.subcategory && (
                      <Badge variant="outline" className="text-xs">
                        {test.subcategory}
                      </Badge>
                    )}
                    <Badge 
                      variant={test.priority === "High" ? "destructive" : test.priority === "Medium" ? "default" : "secondary"}
                    >
                      {test.priority}
                    </Badge>
                    {test.completed ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Circle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {test.assignedTo ? (
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        <User className="h-3 w-3 mr-1" />
                        Assigned
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Unassigned
                      </Badge>
                    )}
                    {/* Disable/Enable Button for Admins */}
                    <TestDisableButton
                      testId={test.id}
                      testTitle={test.title}
                      isDisabled={test.disabled || false}
                      onToggle={(testId, newStatus) => {
                        console.log(`Test ${testId} ${newStatus ? 'disabled' : 'enabled'}`);
                        // Refresh the tests list
                        window.location.reload();
                      }}
                    />
                  </div>
                </div>
                {test.assignedTo && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {test.assignedUserName || "Assigned"}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {test.steps.slice(0, 3).map((step, index) => (
                    <li key={index} className="line-clamp-2">{step}</li>
                  ))}
                  {test.steps.length > 3 && (
                    <li className="text-xs text-muted-foreground">
                      ... and {test.steps.length - 3} more steps
                    </li>
                  )}
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-1">Expected Result:</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {test.expected}
                </p>
              </div>

              {/* Basecamp Cards Section */}
              <div className="border-t pt-4">
                <BasecampCards testId={test.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tests found matching the current filters.</p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="mt-2"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
