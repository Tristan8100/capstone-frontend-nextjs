
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryWrapper({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient(
    {
      defaultOptions: {
        queries: {
          // Always treat data as stale
          staleTime: 0,

          // Auto-refetch when tab is focused
          refetchOnWindowFocus: true,

          // Optional: auto-refetch on network reconnect
          refetchOnReconnect: true,

          // Optional: auto-refetch on mount
          refetchOnMount: true,

          // Optional: limit retries if request fails
          retry: 1,
        },
      },
    }
  ));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}