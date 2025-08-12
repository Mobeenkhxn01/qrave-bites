// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  if (!req.auth && nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin route protection
  if (
    req.auth?.user.role !== "admin" &&
    nextUrl.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)","/dashboard/:path*", "/admin/:path*"],
}