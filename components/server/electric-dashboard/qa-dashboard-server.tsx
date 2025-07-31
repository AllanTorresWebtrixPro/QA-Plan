/**
 * QA Dashboard Server Component
 *
 * Server-side component that handles the main dashboard layout and data fetching.
 * This component is responsible for the overall structure and passes data to client components.
 */

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { QADashboardClient } from "@/components/client/electric-dashboard/qa-dashboard-client";

/**
 * Loading skeleton for the dashboard
 */
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-96 mb-4" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>

        {/* Progress skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main QA Dashboard Server Component
 *
 * This component:
 * - Provides the main layout structure
 * - Handles loading states with Suspense
 * - Delegates data fetching to client components
 */
export default function QADashboardServer() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <QADashboardClient />
    </Suspense>
  );
}
