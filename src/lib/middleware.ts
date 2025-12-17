import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;

  if (!req.auth && nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    req.auth &&
    req.auth.user.role !== "ADMIN" &&
    req.auth.user.role !== "RESTAURANT_OWNER" &&
    nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
