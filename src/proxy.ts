import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const ALLOWED_ROLES = ["ADMIN", "RESTAURANT_OWNER"];

export async function proxy(req: NextRequest) {
  console.log("🔥 PROXY RUNNING:", req.nextUrl.pathname);

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const url = req.nextUrl.clone();

  // 🔐 Not logged in
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role as string | undefined;

  // 🚫 Role not allowed
  if (!role || !ALLOWED_ROLES.includes(role)) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  const restaurantStatus = token.restaurantStatus as string | undefined;

  // ⏳ Not approved
  if (restaurantStatus !== "APPROVED") {
    url.pathname = "/partner-with-us/thank-you";
    return NextResponse.redirect(url);
  }

  const trialEndsAt = token.trialEndsAt
    ? new Date(token.trialEndsAt as string)
    : null;

  const subscriptionStatus = token.subscriptionStatus as string | undefined;

  const trialExpired =
    trialEndsAt !== null && trialEndsAt.getTime() < Date.now();

  const hasActiveSubscription = subscriptionStatus === "active";

  // 💳 Paywall
  if (trialExpired && !hasActiveSubscription) {
    url.pathname = "/billing";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};