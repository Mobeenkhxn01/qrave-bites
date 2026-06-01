import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  try {
    // 🔐 1. Check session
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔍 2. Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    // 🚀 3. PRODUCTION BEST PRACTICE
    // Create Stripe customer if missing
    if (!customerId) {
      console.log("🆕 Creating Stripe customer...");

      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });

      console.log("✅ Stripe customer created:", customerId);
    }

    // 🔥 4. Create billing portal session
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    console.log("✅ Portal created for:", customerId);

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("❌ STRIPE PORTAL ERROR:", err);

    return NextResponse.json(
      { error: err || "Portal creation failed" },
      { status: 400 }
    );
  }
}