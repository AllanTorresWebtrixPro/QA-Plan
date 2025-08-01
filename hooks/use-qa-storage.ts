"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface TestItem {
  id: string
  title: string
  category: string
  priority: "High" | "Medium" | "Low"
  steps: string[]
  expected: string
  edgeCases: string[]
}

export interface UserTestProgress {
  id: string
  user_id: string
  test_id: string
  completed: boolean
  completed_at?: string
  notes?: string
  basecamp_card_ids?: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const DEFAULT_USERS: User[] = [
  { id: "allan-torres", name: "Allan Torres", email: "allan@company.com", avatar: "AT" },
  { id: "joe-karie", name: "Joe Karie", email: "joe@company.com", avatar: "JK" },
  { id: "assaf-chami", name: "Assaf Chami", email: "assaf@company.com", avatar: "AC" },
]

export function useQAStorage() {
  const [tests, setTests] = useState<TestItem[]>([])
  const [userProgress, setUserProgress] = useState<UserTestProgress[]>([])
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tests and user progress from Supabase or localStorage
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Try to load from localStorage first (fallback)
      const savedTests = localStorage.getItem("qa-tests")
      const savedProgress = localStorage.getItem("qa-user-progress")
      const savedCurrentUser = localStorage.getItem("qa-current-user")

      if (savedTests) {
        setTests(JSON.parse(savedTests))
      } else {
        // Initialize with default test data
        await initializeDefaultTests()
      }

      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress))
      }

      if (savedCurrentUser) {
        setCurrentUser(JSON.parse(savedCurrentUser))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultTests = async () => {
    const defaultTests: TestItem[] = [
      {
        id: "auth-001",
        title: "Valid Login Test",
        category: "Authentication",
        priority: "High",
        steps: ["Navigate to login page", "Enter valid email/username", "Enter valid password", 'Click "Login" button'],
        expected: "User is authenticated and redirected to dashboard",
        edgeCases: ["Test with leading/trailing spaces in credentials"],
      },
      {
        id: "auth-002",
        title: "Invalid Credentials Test",
        category: "Authentication",
        priority: "High",
        steps: ["Navigate to login page", "Enter invalid email", "Enter invalid password", 'Click "Login" button'],
        expected: "Error message displayed, user remains on login page",
        edgeCases: ["Test with empty fields", "special characters", "SQL injection attempts"],
      },
      {
        id: "auth-003",
        title: "Password Reset Flow",
        category: "Authentication",
        priority: "High",
        steps: [
          'Click "Forgot Password" link',
          "Enter registered email",
          "Check email for reset link",
          "Click reset link",
          "Enter new password",
          "Confirm new password",
          "Submit",
        ],
        expected: "Password reset email sent, password updated successfully",
        edgeCases: ["Test with non-registered email", "expired reset links", "weak passwords"],
      },
      {
        id: "inv-001",
        title: "Invoice Table Display",
        category: "Invoices",
        priority: "High",
        steps: [
          "Navigate to invoices page",
          "Verify all columns display correctly",
          "Check data formatting",
          "Verify pagination works",
        ],
        expected: "Table shows all invoices with correct data and formatting",
        edgeCases: ["Test with 0 invoices", "1000+ invoices", "special characters in data"],
      },
      {
        id: "inv-002",
        title: "New Invoice Form",
        category: "Invoices",
        priority: "High",
        steps: [
          'Click "New Invoice" button',
          "Fill all required fields",
          "Add invoice items",
          "Set tax rates",
          "Save invoice",
        ],
        expected: "Invoice created successfully, appears in list, all data saved correctly",
        edgeCases: ["Test with maximum field lengths", "special characters", "zero amounts"],
      },
      {
        id: "pro-001",
        title: "Prospect Creation",
        category: "Prospects",
        priority: "Medium",
        steps: ["Navigate to prospects page", 'Click "Add Prospect"', "Fill all required fields", "Save prospect"],
        expected: "Prospect created, appears in list, all data saved",
        edgeCases: ["Test with duplicate emails", "missing required fields", "special characters"],
      },
      {
        id: "cli-001",
        title: "Client Profile Management",
        category: "Clients",
        priority: "Medium",
        steps: ["Create new client", "Add contact information", "Set preferences", "Save profile"],
        expected: "Client profile created with all information saved",
        edgeCases: ["Test with duplicate client data", "missing required information"],
      },
      {
        id: "pay-001",
        title: "Payment Method Management",
        category: "Payments",
        priority: "High",
        steps: ["Add payment method", "Edit payment method", "Remove payment method"],
        expected: "Payment methods managed correctly, validation works",
        edgeCases: ["Test with invalid card numbers", "expired cards"],
      },
    ]

    setTests(defaultTests)
    localStorage.setItem("qa-tests", JSON.stringify(defaultTests))
  }

  const saveData = () => {
    localStorage.setItem("qa-tests", JSON.stringify(tests))
    localStorage.setItem("qa-user-progress", JSON.stringify(userProgress))
    localStorage.setItem("qa-current-user", JSON.stringify(currentUser))
  }

  const getUserProgress = (testId: string, userId: string): UserTestProgress | undefined => {
    return userProgress.find((p) => p.test_id === testId && p.user_id === userId)
  }

  const toggleTestCompletion = async (testId: string) => {
    const existingProgress = getUserProgress(testId, currentUser.id)
    const now = new Date().toISOString()

    if (existingProgress) {
      // Update existing progress
      const updatedProgress = userProgress.map((p) =>
        p.test_id === testId && p.user_id === currentUser.id
          ? {
              ...p,
              completed: !p.completed,
              completed_at: !p.completed ? now : undefined,
              updated_at: now,
            }
          : p,
      )
      setUserProgress(updatedProgress)
    } else {
      // Create new progress entry
      const newProgress: UserTestProgress = {
        id: `${currentUser.id}-${testId}-${Date.now()}`,
        user_id: currentUser.id,
        test_id: testId,
        completed: true,
        completed_at: now,
        created_at: now,
        updated_at: now,
      }
      setUserProgress([...userProgress, newProgress])
    }

    // Save to localStorage
    setTimeout(saveData, 100)
  }

  const addTestNote = async (testId: string, note: string) => {
    const existingProgress = getUserProgress(testId, currentUser.id)
    const now = new Date().toISOString()

    if (existingProgress) {
      // Update existing progress
      const updatedProgress = userProgress.map((p) =>
        p.test_id === testId && p.user_id === currentUser.id ? { ...p, notes: note, updated_at: now } : p,
      )
      setUserProgress(updatedProgress)
    } else {
      // Create new progress entry
      const newProgress: UserTestProgress = {
        id: `${currentUser.id}-${testId}-${Date.now()}`,
        user_id: currentUser.id,
        test_id: testId,
        completed: false,
        notes: note,
        created_at: now,
        updated_at: now,
      }
      setUserProgress([...userProgress, newProgress])
    }

    // Save to localStorage
    setTimeout(saveData, 100)
  }

  const switchUser = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem("qa-current-user", JSON.stringify(user))
  }

  const exportUserResults = (userId?: string) => {
    const targetUserId = userId || currentUser.id
    const targetUser = DEFAULT_USERS.find((u) => u.id === targetUserId)

    const results = tests.map((test) => {
      const progress = getUserProgress(test.id, targetUserId)
      return {
        id: test.id,
        title: test.title,
        category: test.category,
        priority: test.priority,
        completed: progress?.completed || false,
        status: progress?.completed ? "PASS" : "PENDING",
        completedAt: progress?.completed_at || "",
        notes: progress?.notes || "",
      }
    })

    const csvContent = [
      ["Test ID", "Title", "Category", "Priority", "Status", "Completed At", "Notes"],
      ...results.map((r) => [r.id, r.title, r.category, r.priority, r.status, r.completedAt, r.notes]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qa-results-${targetUser?.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAllUsersResults = () => {
    const allResults = DEFAULT_USERS.flatMap((user) =>
      tests.map((test) => {
        const progress = getUserProgress(test.id, user.id)
        return {
          user: user.name,
          testId: test.id,
          title: test.title,
          category: test.category,
          priority: test.priority,
          completed: progress?.completed || false,
          status: progress?.completed ? "PASS" : "PENDING",
          completedAt: progress?.completed_at || "",
          notes: progress?.notes || "",
        }
      }),
    )

    const csvContent = [
      ["User", "Test ID", "Title", "Category", "Priority", "Status", "Completed At", "Notes"],
      ...allResults.map((r) => [r.user, r.testId, r.title, r.category, r.priority, r.status, r.completedAt, r.notes]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qa-results-all-users-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Get current user's test completion status
  const getTestsWithUserProgress = () => {
    return tests.map((test) => {
      const progress = getUserProgress(test.id, currentUser.id)
      return {
        ...test,
        completed: progress?.completed || false,
        completedAt: progress?.completed_at,
        notes: progress?.notes,
      }
    })
  }

  // Get statistics for current user
  const getCurrentUserStats = () => {
    const testsWithProgress = getTestsWithUserProgress()
    const completed = testsWithProgress.filter((t) => t.completed).length
    const total = testsWithProgress.length
    const highPriorityRemaining = testsWithProgress.filter((t) => t.priority === "High" && !t.completed).length

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
      highPriorityRemaining,
    }
  }

  // Get statistics for all users
  const getAllUsersStats = () => {
    return DEFAULT_USERS.map((user) => {
      const userTests = tests.map((test) => {
        const progress = getUserProgress(test.id, user.id)
        return { ...test, completed: progress?.completed || false }
      })

      const completed = userTests.filter((t) => t.completed).length
      const total = userTests.length

      return {
        user,
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      }
    })
  }

  return {
    tests: getTestsWithUserProgress(),
    currentUser,
    users: DEFAULT_USERS,
    loading,
    error,
    toggleTestCompletion,
    addTestNote,
    switchUser,
    exportUserResults,
    exportAllUsersResults,
    getUserProgress,
    getCurrentUserStats,
    getAllUsersStats,
    refreshData: loadData,
  }
}
