"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { CartProvider } from "@/context/CardContext";
import ClientLoadingWrapper from "@/providers/ClientLoadingWrapper";
import LoginModalWrapper from "@/providers/LoginDialogWrapper";
import { Suspense } from "react";
import PusherProvider from "./PusherProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>

      <ReactQueryProvider>
        <CartProvider>
          <ClientLoadingWrapper>
            <SessionProvider>
        <PusherProvider>
              {children}
              <LoginModalWrapper />
        </PusherProvider>
            </SessionProvider>
          </ClientLoadingWrapper>
        </CartProvider>
      </ReactQueryProvider>
    </Suspense>
  );
}
