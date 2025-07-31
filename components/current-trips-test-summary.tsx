"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Clock, MapPin, Search, Table, Settings } from "lucide-react"

interface CurrentTripsTestSummaryProps {
  tests: Array<{
    id: string
    title: string
    category: string
    priority: "High" | "Medium" | "Low"
    completed: boolean
  }>
  currentUser: {
    name: string
  }
}

export function CurrentTripsTestSummary({ tests, currentUser }: CurrentTripsTestSummaryProps) {
  const currentTripsTests = tests.filter((test) => test.category === "Current Trips")
  const completedCurrentTripsTests = currentTripsTests.filter((test) => test.completed)
  const highPriorityCurrentTripsTests = currentTripsTests.filter((test) => test.priority === "High")
  const completedHighPriority = highPriorityCurrentTripsTests.filter((test) => test.completed)

  const currentTripsProgress =
    currentTripsTests.length > 0 ? (completedCurrentTripsTests.length / currentTripsTests.length) * 100 : 0

  const currentTripsCategories = [
    {
      name: "Dashboard & Display",
      tests: currentTripsTests.filter((t) => t.id.startsWith("ct-00") && Number.parseInt(t.id.split("-")[1]) <= 4),
      icon: Table,
      description: "Dashboard display, search, table columns, and row expansion",
    },
    {
      name: "Trip Actions",
      tests: currentTripsTests.filter(
        (t) =>
          t.id.startsWith("ct-00") &&
          Number.parseInt(t.id.split("-")[1]) >= 5 &&
          Number.parseInt(t.id.split("-")[1]) <= 9,
      ),
      icon: Settings,
      description: "Trip actions, invoice creation, date formatting, and status badges",
    },
    {
      name: "Table Functionality",
      tests: currentTripsTests.filter(
        (t) =>
          t.id.startsWith("ct-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 10 &&
          Number.parseInt(t.id.split("-")[1]) <= 15,
      ),
      icon: Search,
      description: "Sorting, pagination, data refresh, and information display",
    },
    {
      name: "User Experience",
      tests: currentTripsTests.filter(
        (t) =>
          t.id.startsWith("ct-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 16 &&
          Number.parseInt(t.id.split("-")[1]) <= 20,
      ),
      icon: CheckCircle,
      description: "Export, bulk actions, mobile responsiveness, and error handling",
    },
    {
      name: "Integration",
      tests: currentTripsTests.filter(
        (t) =>
          t.id.startsWith("ct-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 21 &&
          Number.parseInt(t.id.split("-")[1]) <= 25,
      ),
      icon: MapPin,
      description: "Pre-trip, invoice, survey, and client profile integration",
    },
    {
      name: "Advanced Features",
      tests: currentTripsTests.filter((t) => t.id.startsWith("ct-0") && Number.parseInt(t.id.split("-")[1]) >= 26),
      icon: AlertTriangle,
      description: "Advanced search, favorites, print, audit trail, and validation",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Current Trips Testing Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Trips Testing Overview - {currentUser.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedCurrentTripsTests.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentTripsTests.length - completedCurrentTripsTests.length}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(currentTripsProgress)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          <Progress value={currentTripsProgress} className="h-3" />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              Current Trips Tests: {completedCurrentTripsTests.length}/{currentTripsTests.length}
            </span>
            <span>
              High Priority: {completedHighPriority.length}/{highPriorityCurrentTripsTests.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Current Trips Test Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTripsCategories.map((category) => {
          const completed = category.tests.filter((t) => t.completed).length
          const total = category.tests.length
          const progress = total > 0 ? (completed / total) * 100 : 0

          return (
            <Card key={category.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {completed}/{total}
                  </span>
                  <Badge variant={progress === 100 ? "default" : progress > 0 ? "secondary" : "outline"}>
                    {Math.round(progress)}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="mt-2 text-xs text-gray-600">
                  {category.tests.filter((t) => t.priority === "High").length} high priority
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Trips Test Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Current Trips Test Priorities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["High", "Medium", "Low"].map((priority) => {
              const priorityTests = currentTripsTests.filter((t) => t.priority === priority)
              const priorityCompleted = priorityTests.filter((t) => t.completed).length
              const priorityProgress = priorityTests.length > 0 ? (priorityCompleted / priorityTests.length) * 100 : 0

              return (
                <div key={priority}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Badge
                        variant={priority === "High" ? "destructive" : priority === "Medium" ? "default" : "secondary"}
                      >
                        {priority}
                      </Badge>
                      Priority Tests
                    </span>
                    <span>
                      {priorityCompleted}/{priorityTests.length}
                    </span>
                  </div>
                  <Progress value={priorityProgress} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Testing Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Key Current Trips Testing Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Core Functionality</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Dashboard display and loading</li>
                <li>• Search and filtering capabilities</li>
                <li>• Table columns and row expansion</li>
                <li>• Trip actions (View, Create Invoice, etc.)</li>
                <li>• Date formatting consistency</li>
                <li>• Survey status badges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Integration & Advanced</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Pre-trip integration</li>
                <li>• Invoice creation workflow</li>
                <li>• Survey status integration</li>
                <li>• Client profile navigation</li>
                <li>• Data validation and error handling</li>
                <li>• Mobile responsiveness</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Current Trips Testing Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Essential Tests</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Dashboard loads without errors
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-orange-600" />
                  Search and filtering works correctly
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-orange-600" />
                  Row expansion shows lodge details
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-orange-600" />
                  All trip actions function properly
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Edge Cases</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  Empty state handling
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  Large datasets performance
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  Network error scenarios
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  Mobile responsiveness
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
