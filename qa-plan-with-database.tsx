"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Download, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react"
import { useQAStorage } from "./hooks/use-qa-storage"

export default function QAPlanWithDatabase() {
  const { tests, loading, error, toggleTestCompletion, addTestNote, exportTests } = useQAStorage()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({})

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading QA Plan...</span>
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
              Error Loading Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
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

  const completedTests = tests.filter((test) => test.completed).length
  const totalTests = tests.length
  const progressPercentage = totalTests > 0 ? (completedTests / totalTests) * 100 : 0

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MTP Application QA Plan</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-gray-600 mt-2">
                {completedTests} of {totalTests} tests completed ({Math.round(progressPercentage)}%)
              </p>
            </div>
            <Button onClick={exportTests} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Results
            </Button>
          </div>
        </div>

        {/* Rest of the component remains the same, but with enhanced test cards that include notes */}
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <Card key={test.id} className={`transition-all ${test.completed ? "bg-green-50 border-green-200" : ""}`}>
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
                          Completed on {new Date(test.completedAt).toLocaleDateString()}
                          {test.completedBy && ` by ${test.completedBy}`}
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
                    <Button onClick={() => handleAddNote(test.id)} disabled={!noteInputs[test.id]?.trim()} size="sm">
                      Report Issue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
