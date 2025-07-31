"use client";

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * QueryClientProvider - Manages application-wide query state
 *
 * This component provides the QueryClient instance to all child components,
 * enabling them to use React Query hooks for data fetching and caching.
 *
 * Features:
 * - Global query state management
 * - Automatic caching and background refetching
 * - Error handling and retry logic
 * - Development tools integration
 */
export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Retry failed requests up to 3 times
            retry: 3,
            // Refetch on window focus
            refetchOnWindowFocus: false,
            // Cache data for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
          },
          mutations: {
            // Retry failed mutations up to 2 times
            retry: 2,
          },
        },
      })
  );

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      {/* Development tools - only shown in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </TanstackQueryClientProvider>
  );
}
