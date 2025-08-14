import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/actions/auth-context";
import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import {CartProvider} from "@/context/CardContext"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Qrave-bites",
  description: "A QR Code based food ordering website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ReactQueryProvider>
            <CartProvider>
          <SessionProvider>
            <AuthProvider>
              {/* <Navbar /> */}
              {children}
              {/* <Footer />  */}
            </AuthProvider>
          </SessionProvider>
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
