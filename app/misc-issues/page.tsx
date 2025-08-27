import { Suspense } from "react";
import { MiscIssuesClient } from "@/components/client/misc-issues/misc-issues-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function MiscIssuesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Miscellaneous Issues</h1>
        <p className="text-muted-foreground">
          Report and manage issues that don't fit into specific test categories
        </p>
      </div>
      
      <Suspense fallback={<MiscIssuesSkeleton />}>
        <MiscIssuesClient />
      </Suspense>
    </div>
  );
}

function MiscIssuesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
