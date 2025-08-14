"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { User, Session } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  name: string
  avatar?: string
  role: 'admin' | 'tester'
  created_at: string
  updated_at: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string, role?: 'admin' | 'tester') => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      return null
    }
  }

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('AuthProvider: Timeout reached, forcing loading to false')
      setLoading(false)
    }, 10000) // 10 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Starting initial session check...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('AuthProvider: Initial session result:', { hasSession: !!session, hasUser: !!session?.user })
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('AuthProvider: Initial session has user, fetching profile for:', session.user.id)
          const userProfile = await fetchUserProfile(session.user.id)
          console.log('AuthProvider: Initial profile fetch result:', userProfile ? 'success' : 'failed')
          setProfile(userProfile)
        } else {
          console.log('AuthProvider: No initial session')
        }
        
        console.log('AuthProvider: Setting loading to false')
        setLoading(false)
        clearTimeout(timeout)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setLoading(false)
        clearTimeout(timeout)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('AuthProvider: User authenticated, fetching profile for:', session.user.id)
          const userProfile = await fetchUserProfile(session.user.id)
          setProfile(userProfile)
          console.log('AuthProvider: Profile fetched:', userProfile ? 'success' : 'failed')
        } else {
          console.log('AuthProvider: No session, clearing profile')
          setProfile(null)
        }
        
        setLoading(false)
        clearTimeout(timeout)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Starting sign in for:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('AuthProvider: Sign in result:', { error: error?.message || 'success' })
    return { error }
  }

  const signUp = async (email: string, password: string, name: string, role: 'admin' | 'tester' = 'tester') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
          role
        }
      }
    })
    return { error }
  }

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear local state first to provide immediate feedback
      setUser(null)
      setSession(null)
      setProfile(null)
      
      // Clear any cached data
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear any cookies (if using js-cookie or similar)
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      }
      
      // Call Supabase sign out
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase sign out error:', error)
        throw error
      }
      
      console.log('Sign out successful');
      
      // Force a page reload to clear any remaining state
      if (typeof window !== 'undefined') {
        // Small delay to ensure state is cleared
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 100);
      }
      
    } catch (error) {
      console.error('Sign out failed:', error)
      
      // Even if Supabase sign out fails, clear local state and redirect
      setUser(null)
      setSession(null)
      setProfile(null)
      
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/auth/login';
      }
      
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 