"use client"

import { createContext, useContext, useMemo } from "react"
import useSWR from "swr"
import { authClient } from "@/lib/auth-client"

export interface UserProfile {
  id: string
  name: string
  email?: string | null
  avatar?: string
  role: "admin" | "tester"
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: { name?: string; avatar?: string }
}

interface AuthContextType {
  user: AuthUser | null
  session: { user: AuthUser } | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string, role?: "admin" | "tester") => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  refreshProfile: () => Promise<unknown>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const profileFetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" })
  if (!res.ok) return null
  return (await res.json()) as UserProfile | null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending, refetch } = authClient.useSession()
  const sessionUser = sessionData?.user ?? null

  const {
    data: profile,
    isLoading: profileLoading,
    mutate: mutateProfile,
  } = useSWR(sessionUser ? ["/api/me", sessionUser.id] : null, ([url]) => profileFetcher(url))

  const user = useMemo<AuthUser | null>(() => {
    if (!sessionUser) return null
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      user_metadata: { name: profile?.name ?? sessionUser.name, avatar: profile?.avatar },
    }
  }, [sessionUser, profile])

  const signIn = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password })
    if (!error) await refetch()
    return { error: error ? { message: error.message ?? "Invalid email or password" } : null }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await authClient.signUp.email({ email, password, name })
    if (!error) await refetch()
    return { error: error ? { message: error.message ?? "Unable to create account" } : null }
  }

  const signOut = async () => {
    try {
      await authClient.signOut()
    } finally {
      await mutateProfile(null, { revalidate: false })
      window.location.href = "/auth/login"
    }
  }

  const resetPassword = async () => ({
    error: {
      message:
        "Password reset emails are not configured. Ask an admin to help, or change your password from your Profile once signed in.",
    },
  })

  const value: AuthContextType = {
    user,
    session: user ? { user } : null,
    profile: profile ?? null,
    loading: isPending || (!!sessionUser && profileLoading),
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile: () => mutateProfile(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
