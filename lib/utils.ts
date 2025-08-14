import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Role-based access control utilities
export type UserRole = 'admin' | 'tester'

export interface UserProfile {
  id: string
  name: string
  avatar?: string
  role: UserRole
  created_at: string
  updated_at: string
}

/**
 * Check if a user has admin role
 */
export function isAdmin(profile: UserProfile | null): boolean {
  return profile?.role === 'admin'
}

/**
 * Check if a user has tester role
 */
export function isTester(profile: UserProfile | null): boolean {
  return profile?.role === 'tester'
}

/**
 * Check if a user has a specific role
 */
export function hasRole(profile: UserProfile | null, role: UserRole): boolean {
  return profile?.role === role
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(profile: UserProfile | null, roles: UserRole[]): boolean {
  return profile?.role ? roles.includes(profile.role) : false
}

/**
 * Filter navigation items based on user role
 */
export function filterNavigationByRole<T extends { adminOnly?: boolean; testerOnly?: boolean }>(
  items: T[],
  profile: UserProfile | null
): T[] {
  if (!profile) return items.filter(item => !item.adminOnly && !item.testerOnly)
  
  return items.filter(item => {
    if (item.adminOnly && !isAdmin(profile)) return false
    if (item.testerOnly && !isTester(profile)) return false
    return true
  })
}
