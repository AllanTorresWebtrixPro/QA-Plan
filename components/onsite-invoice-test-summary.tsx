"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Clock, CreditCard, FileText, Settings, Shield } from "lucide-react"

interface OnsiteInvoiceTestSummaryProps {
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

export function OnsiteInvoiceTestSummary({ tests, currentUser }: OnsiteInvoiceTestSummaryProps) {
  const onsiteInvoiceTests = tests.filter((test) => test.category === "On-Site Invoices")
  const completedOnsiteInvoiceTests = onsiteInvoiceTests.filter((test) => test.completed)
  const highPriorityOnsiteInvoiceTests = onsiteInvoiceTests.filter((test) => test.priority === "High")
  const completedHighPriority = highPriorityOnsiteInvoiceTests.filter((test) => test.completed)

  const onsiteInvoiceProgress =
    onsiteInvoiceTests.length > 0 ? (completedOnsiteInvoiceTests.length / onsiteInvoiceTests.length) * 100 : 0

  const onsiteInvoiceCategories = [
    {
      name: "Dashboard & Display",
      tests: onsiteInvoiceTests.filter((t) => t.id.startsWith("osi-00") && Number.parseInt(t.id.split("-")[1]) <= 7),
      icon: FileText,
      description: "Dashboard KPIs, table display, and status badges",
    },
    {
      name: "Invoice Management",
      tests: onsiteInvoiceTests.filter(
        (t) =>
          t.id.startsWith("osi-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 8 &&
          Number.parseInt(t.id.split("-")[1]) <= 14,
      ),
      icon: Settings,
      description: "Viewing, editing, and item management",
    },
    {
      name: "Payment Processing",
      tests: onsiteInvoiceTests.filter(
        (t) =>
          t.id.startsWith("osi-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 15 &&
          Number.parseInt(t.id.split("-")[1]) <= 20,
      ),
      icon: CreditCard,
      description: "QR codes, payment links, and gateway integration",
    },
    {
      name: "Individual Pages",
      tests: onsiteInvoiceTests.filter(
        (t) =>
          t.id.startsWith("osi-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 21 &&
          Number.parseInt(t.id.split("-")[1]) <= 23,
      ),
      icon: CheckCircle,
      description: "Individual invoice pages and deletion workflow",
    },
    {
      name: "Integration & Workflow",
      tests: onsiteInvoiceTests.filter(
        (t) =>
          t.id.startsWith("osi-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 24 &&
          Number.parseInt(t.id.split("-")[1]) <= 26,
      ),
      icon: AlertTriangle,
      description: "Status workflow and data consistency",
    },
    {
      name: "Additional Features",
      tests: onsiteInvoiceTests.filter(
        (t) =>
          t.id.startsWith("osi-0") &&
          Number.parseInt(t.id.split("-")[1]) >= 27 &&
          Number.parseInt(t.id.split("-")[1]) <= 30,
      ),
      icon: Clock,
      description: "Search, bulk operations, email, and print",
    },
    {
      name: "Performance & Security",
      tests: onsiteInvoiceTests.filter((t) => t.id.startsWith("osi-0") && Number.parseInt(t.id.split("-")[1]) >= 31),
      icon: Shield,
      description: "Performance testing and security validation",
    },
  ]

  return (
    <div className="space-y-6">
      {/* On-Site Invoice Testing Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            On-Site Invoice Testing Overview - {currentUser.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedOnsiteInvoiceTests.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {onsiteInvoiceTests.length - completedOnsiteInvoiceTests.length}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(onsiteInvoiceProgress)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          <Progress value={onsiteInvoiceProgress} className="h-3" />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              On-Site Invoice Tests: {completedOnsiteInvoiceTests.length}/{onsiteInvoiceTests.length}
            </span>
            <span>
              High Priority: {completedHighPriority.length}/{highPriorityOnsiteInvoiceTests.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* On-Site Invoice Test Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {onsiteInvoiceCategories.map((category) => {
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

      {/* On-Site Invoice Test Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>On-Site Invoice Test Priorities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["High", "Medium", "Low"].map((priority) => {
              const priorityTests = onsiteInvoiceTests.filter((t) => t.priority === priority)
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
          <CardTitle>Key On-Site Invoice Testing Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Critical Functionality</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Dashboard KPIs and metrics accuracy</li>
                <li>• Invoice table display and sorting</li>
                <li>• Payment processing and gateway integration</li>
                <li>• QR code and payment link generation</li>
                <li>• Invoice editing and item management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Integration Points</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Status workflow and transitions</li>
                <li>• Data consistency across operations</li>
                <li>• Reporting system integration</li>
                <li>• Email and print functionality</li>
                <li>• Security and performance validation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
