"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { CartProvider } from "@/context/CardContext";
import { Suspense, memo } from "react";
import PusherProvider from "./PusherProvider";

// Memoize to prevent unnecessary re-renders
const MemoizedCartProvider = memo(CartProvider);
const MemoizedPusherProvider = memo(PusherProvider);

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <SessionProvider>
        <Suspense fallback={null}>
          <MemoizedCartProvider>
            <MemoizedPusherProvider>
              {children}
            </MemoizedPusherProvider>
          </MemoizedCartProvider>
        </Suspense>
      </SessionProvider>
    </ReactQueryProvider>
  );
}
