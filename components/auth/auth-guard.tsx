"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user && !redirecting) {
      setRedirecting(true)
      router.push("/auth/login")
    }
  }, [user, loading, router, redirecting])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading authentication...</span>
        </div>
      </div>
    )
  }

  // Don't render anything if user is not authenticated
  // This prevents any flash of content before redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Redirecting to login...</span>
        </div>
      </div>
    )
  }

  // User is authenticated, render the protected content
  return <>{children}</>
} 