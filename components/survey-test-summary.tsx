"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Clock, BarChart3 } from "lucide-react"

interface SurveyTestSummaryProps {
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

export function SurveyTestSummary({ tests, currentUser }: SurveyTestSummaryProps) {
  const surveyTests = tests.filter((test) => test.category === "Surveys")
  const completedSurveyTests = surveyTests.filter((test) => test.completed)
  const highPrioritySurveyTests = surveyTests.filter((test) => test.priority === "High")
  const completedHighPriority = highPrioritySurveyTests.filter((test) => test.completed)

  const surveyProgress = surveyTests.length > 0 ? (completedSurveyTests.length / surveyTests.length) * 100 : 0

  const surveyCategories = [
    {
      name: "Dashboard & Overview",
      tests: surveyTests.filter((t) => t.id.startsWith("srv-00") && Number.parseInt(t.id.split("-")[1]) <= 3),
      icon: BarChart3,
    },
    {
      name: "Survey Management",
      tests: surveyTests.filter(
        (t) =>
          t.id.startsWith("srv-00") &&
          Number.parseInt(t.id.split("-")[1]) >= 4 &&
          Number.parseInt(t.id.split("-")[1]) <= 8,
      ),
      icon: CheckCircle,
    },
    {
      name: "Section Management",
      tests: surveyTests.filter(
        (t) =>
          t.id.startsWith("srv-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 9 &&
          Number.parseInt(t.id.split("-")[1]) <= 12,
      ),
      icon: AlertTriangle,
    },
    {
      name: "Question Management",
      tests: surveyTests.filter(
        (t) =>
          t.id.startsWith("srv-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 13 &&
          Number.parseInt(t.id.split("-")[1]) <= 18,
      ),
      icon: Clock,
    },
    {
      name: "User Experience",
      tests: surveyTests.filter(
        (t) =>
          t.id.startsWith("srv-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 19 &&
          Number.parseInt(t.id.split("-")[1]) <= 24,
      ),
      icon: CheckCircle,
    },
    {
      name: "Submissions & Analytics",
      tests: surveyTests.filter(
        (t) =>
          t.id.startsWith("srv-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 25 &&
          Number.parseInt(t.id.split("-")[1]) <= 29,
      ),
      icon: BarChart3,
    },
    {
      name: "Integration & Workflow",
      tests: surveyTests.filter((t) => t.id.startsWith("srv-0") && Number.parseInt(t.id.split("-")[1]) >= 30),
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Survey Testing Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Survey Testing Overview - {currentUser.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedSurveyTests.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {surveyTests.length - completedSurveyTests.length}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(surveyProgress)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          <Progress value={surveyProgress} className="h-3" />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              Survey Tests: {completedSurveyTests.length}/{surveyTests.length}
            </span>
            <span>
              High Priority: {completedHighPriority.length}/{highPrioritySurveyTests.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Survey Test Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surveyCategories.map((category) => {
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

      {/* Survey Test Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Test Priorities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["High", "Medium", "Low"].map((priority) => {
              const priorityTests = surveyTests.filter((t) => t.priority === priority)
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
    </div>
  )
}
