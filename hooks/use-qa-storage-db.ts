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

export function useQAStorageDB() {
  const [tests, setTests] = useState<TestItem[]>([])
  const [userProgress, setUserProgress] = useState<UserTestProgress[]>([])
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from database
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load tests from database
      const { data: testsData, error: testsError } = await supabase
        .from("qa_tests")
        .select("*")
        .order("category", { ascending: true })

      if (testsError) throw testsError

      // Transform database data to match our interface
      const transformedTests: TestItem[] = testsData.map((test) => ({
        id: test.id,
        title: test.title,
        category: test.category,
        priority: test.priority,
        steps: Array.isArray(test.steps) ? test.steps : JSON.parse(test.steps || "[]"),
        expected: test.expected,
        edgeCases: Array.isArray(test.edge_cases) ? test.edge_cases : JSON.parse(test.edge_cases || "[]"),
      }))

      setTests(transformedTests)

      // Load user progress from database
      const { data: progressData, error: progressError } = await supabase
        .from("qa_user_test_progress")
        .select("*")
        .order("updated_at", { ascending: false })

      if (progressError) throw progressError

      setUserProgress(progressData || [])

      // Load current user from localStorage (fallback to first user)
      const savedCurrentUser = localStorage.getItem("qa-current-user")
      if (savedCurrentUser) {
        try {
          setCurrentUser(JSON.parse(savedCurrentUser))
        } catch {
          setCurrentUser(DEFAULT_USERS[0])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data from database")
      console.error("Database error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getUserProgress = (testId: string, userId: string): UserTestProgress | undefined => {
    return userProgress.find((p) => p.test_id === testId && p.user_id === userId)
  }

  const toggleTestCompletion = async (testId: string) => {
    try {
      const existingProgress = getUserProgress(testId, currentUser.id)
      const now = new Date().toISOString()

      if (existingProgress) {
        // Update existing progress in database
        const updatedData = {
          completed: !existingProgress.completed,
          completed_at: !existingProgress.completed ? now : null,
          updated_at: now,
        }

        const { error } = await supabase.from("qa_user_test_progress").update(updatedData).eq("id", existingProgress.id)

        if (error) throw error

        // Update local state
        setUserProgress((prev) => prev.map((p) => (p.id === existingProgress.id ? { ...p, ...updatedData } : p)))
      } else {
        // Create new progress entry in database
        const newProgress = {
          id: `${currentUser.id}-${testId}-${Date.now()}`,
          user_id: currentUser.id,
          test_id: testId,
          completed: true,
          completed_at: now,
          created_at: now,
          updated_at: now,
        }

        const { error } = await supabase.from("qa_user_test_progress").insert([newProgress])

        if (error) throw error

        // Update local state
        setUserProgress((prev) => [...prev, newProgress])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update test progress")
      console.error("Error updating progress:", err)
    }
  }

  const addTestNote = async (testId: string, note: string) => {
    try {
      const existingProgress = getUserProgress(testId, currentUser.id)
      const now = new Date().toISOString()

      if (existingProgress) {
        // Update existing progress
        const updatedData = {
          notes: note,
          updated_at: now,
        }

        const { error } = await supabase.from("qa_user_test_progress").update(updatedData).eq("id", existingProgress.id)

        if (error) throw error

        // Update local state
        setUserProgress((prev) => prev.map((p) => (p.id === existingProgress.id ? { ...p, ...updatedData } : p)))
      } else {
        // Create new progress entry
        const newProgress = {
          id: `${currentUser.id}-${testId}-${Date.now()}`,
          user_id: currentUser.id,
          test_id: testId,
          completed: false,
          notes: note,
          created_at: now,
          updated_at: now,
        }

        const { error } = await supabase.from("qa_user_test_progress").insert([newProgress])

        if (error) throw error

        // Update local state
        setUserProgress((prev) => [...prev, newProgress])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note")
      console.error("Error adding note:", err)
    }
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

  // Verify database connection
  const verifyDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("count", { count: "exact" })
      if (error) throw error
      return { success: true, userCount: data?.[0]?.count || 0 }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Database connection failed" }
    }
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
    verifyDatabaseConnection,
  }
}
