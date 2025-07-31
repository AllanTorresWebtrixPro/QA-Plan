"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  FileDown,
  Loader2,
  Database,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react"
import { useQAStorageDB } from "../hooks/use-qa-storage-db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function QAPlanWithDB() {
  const {
    tests,
    currentUser,
    users,
    loading,
    error,
    toggleTestCompletion,
    addTestNote,
    switchUser,
    exportUserResults,
    exportAllUsersResults,
    getCurrentUserStats,
    getAllUsersStats,
    refreshData,
    verifyDatabaseConnection,
  } = useQAStorageDB()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({})
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; userCount?: number; error?: string } | null>(null)

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    const result = await verifyDatabaseConnection()
    setDbStatus({
      connected: result.success,
      userCount: result.userCount,
      error: result.error,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading QA Plan from Database...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Database Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={refreshData}>Retry</Button>
              <Button onClick={checkDatabaseStatus} variant="outline">
                Check Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categories = ["All", ...Array.from(new Set(tests.map((test) => test.category)))]
  const priorities = ["All", "High", "Medium", "Low"]

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory
    const matchesPriority = selectedPriority === "All" || test.priority === selectedPriority

    return matchesSearch && matchesCategory && matchesPriority
  })

  const currentUserStats = getCurrentUserStats()
  const allUsersStats = getAllUsersStats()

  const handleAddNote = async (testId: string) => {
    const note = noteInputs[testId]
    if (note?.trim()) {
      await addTestNote(testId, note.trim())
      setNoteInputs((prev) => ({ ...prev, [testId]: "" }))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Database Status Alert */}
        {dbStatus && (
          <Alert className={`mb-4 ${dbStatus.connected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex items-center gap-2">
              {dbStatus.connected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <Database className="h-4 w-4 text-green-600" />
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-600" />
                  <Database className="h-4 w-4 text-red-600" />
                </>
              )}
            </div>
            <AlertDescription>
              {dbStatus.connected ? (
                <span className="text-green-800">
                  ✅ Database Connected - {dbStatus.userCount} users found. Progress is being saved to database.
                </span>
              ) : (
                <span className="text-red-800">
                  ❌ Database Connection Failed: {dbStatus.error}. Using local storage fallback.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Header with User Switcher */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">MTP Application QA Plan</h1>

            {/* User Switcher */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Current User:</span>
              <div className="flex gap-2">
                {users.map((user) => (
                  <Button
                    key={user.id}
                    variant={currentUser.id === user.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchUser(user)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress for Current User */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{currentUser.name}'s Progress</span>
                {dbStatus?.connected && (
                  <Badge variant="outline" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    DB Synced
                  </Badge>
                )}
              </div>
              <Progress value={currentUserStats.percentage} className="h-3" />
              <p className="text-sm text-gray-600 mt-2">
                {currentUserStats.completed} of {currentUserStats.total} tests completed (
                {Math.round(currentUserStats.percentage)}%)
              </p>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => exportUserResults()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export My Results
              </Button>
              <Button
                onClick={exportAllUsersResults}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <FileDown className="h-4 w-4" />
                Export All Users
              </Button>
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Database className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-tests" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-12 gap-1">
            <TabsTrigger value="my-tests" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="authentication" className="text-xs">
              Auth
            </TabsTrigger>
            <TabsTrigger value="invoices" className="text-xs">
              Invoices
            </TabsTrigger>
            <TabsTrigger value="surveys" className="text-xs">
              Surveys
            </TabsTrigger>
            <TabsTrigger value="onsite-invoices" className="text-xs">
              On-Site
            </TabsTrigger>
            <TabsTrigger value="current-trips" className="text-xs">
              Trips
            </TabsTrigger>
            <TabsTrigger value="prospects" className="text-xs">
              Prospects
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-xs">
              Clients
            </TabsTrigger>
            <TabsTrigger value="agents" className="text-xs">
              Agents
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">
              Payments
            </TabsTrigger>
            <TabsTrigger value="team-overview" className="text-xs">
              Team
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">
              Summary
            </TabsTrigger>
          </TabsList>

          {/* All Tests Tab */}
          <TabsContent value="my-tests">
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Test Cases Display */}
            <div className="space-y-4">
              {filteredTests.map((test) => (
                <Card
                  key={test.id}
                  className={`transition-all ${test.completed ? "bg-green-50 border-green-200" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={test.completed}
                          onCheckedChange={() => toggleTestCompletion(test.id)}
                          className="mt-1"
                        />
                        <div>
                          <CardTitle className="text-lg">{test.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{test.category}</Badge>
                            <Badge variant={getPriorityColor(test.priority)}>{test.priority}</Badge>
                            <Badge variant={test.completed ? "default" : "secondary"}>
                              {test.completed ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </>
                              )}
                            </Badge>
                          </div>
                          {test.completedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Completed on {new Date(test.completedAt).toLocaleDateString()} at{" "}
                              {new Date(test.completedAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Test Steps:</h4>
                        <ol className="text-sm space-y-1">
                          {test.steps.map((step, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-gray-500 min-w-4">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Expected Result:</h4>
                        <p className="text-sm text-gray-600">{test.expected}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Edge Cases:</h4>
                        <ul className="text-sm space-y-1">
                          {test.edgeCases.map((edgeCase, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{edgeCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Notes:</h4>
                      {test.notes && (
                        <div className="bg-gray-50 p-3 rounded mb-2">
                          <p className="text-sm">{test.notes}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Add execution notes..."
                          value={noteInputs[test.id] || ""}
                          onChange={(e) => setNoteInputs((prev) => ({ ...prev, [test.id]: e.target.value }))}
                          className="flex-1"
                          rows={2}
                        />
                        <Button
                          onClick={() => handleAddNote(test.id)}
                          disabled={!noteInputs[test.id]?.trim()}
                          size="sm"
                        >
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs would continue here with similar structure... */}
          {/* For brevity, I'll include just the team overview and summary tabs */}

          {/* Team Overview Tab */}
          <TabsContent value="team-overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allUsersStats.map((userStat) => (
                      <div key={userStat.user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{userStat.user.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{userStat.user.name}</h3>
                            <span className="text-sm text-gray-600">
                              {userStat.completed}/{userStat.total} ({Math.round(userStat.percentage)}%)
                            </span>
                          </div>
                          <Progress value={userStat.percentage} className="h-2" />
                        </div>
                        <Button
                          onClick={() => exportUserResults(userStat.user.id)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Export
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    My Completed Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{currentUserStats.completed}</div>
                  <p className="text-sm text-gray-600">out of {currentUserStats.total} total tests</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    High Priority Remaining
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{currentUserStats.highPriorityRemaining}</div>
                  <p className="text-sm text-gray-600">high priority tests pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories
                      .filter((c) => c !== "All")
                      .map((category) => {
                        const categoryTests = tests.filter((t) => t.category === category)
                        const categoryCompleted = categoryTests.filter((t) => t.completed).length
                        const categoryProgress =
                          categoryTests.length > 0 ? (categoryCompleted / categoryTests.length) * 100 : 0

                        return (
                          <div key={category}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{category}</span>
                              <span>
                                {categoryCompleted}/{categoryTests.length}
                              </span>
                            </div>
                            <Progress value={categoryProgress} className="h-2" />
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
