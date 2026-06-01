"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function ReactQueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000, // 30 seconds - more frequent updates
          gcTime: 5 * 60 * 1000, // 5 minutes cache time
          retry: (failureCount, error: any) => {
            // Only retry on network errors, not 4xx/5xx
            if (error?.status >= 400 && error?.status < 500) return false;
            return failureCount < 3;
          },
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
        },
        mutations: {
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
