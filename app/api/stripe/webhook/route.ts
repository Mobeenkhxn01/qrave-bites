import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { PRICE_TO_PLAN } from "@/lib/plan";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.MOBEEN_STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ WEBHOOK SIGNATURE ERROR:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }

  // ✅ IDEMPOTENCY GUARD (CRITICAL)
  const existing = await prisma.stripeEvent.findUnique({
    where: { id: event.id },
  });

  if (existing) {
    console.log("⚠️ Duplicate webhook ignored:", event.id);
    return NextResponse.json({ received: true });
  }

  await prisma.stripeEvent.create({
    data: { id: event.id },
  });

  try {
    // ======================================================
    // 🟢 ORDER PAYMENT SUCCESS
    // ======================================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // ✅ only handle order payments here
      if (session.mode === "payment") {
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: {
              paid: true,
              status: "CONFIRMED",
              stripeSessionId: session.id,
            },
          });

          await prisma.notification.create({
            data: {
              restaurantId: order.restaurantId,
              orderId: order.id,
              type: "NEW_ORDER",
              message: `Paid order #${order.orderNumber}`,
            },
          });

          await pusherServer.trigger(
            `restaurant-${order.restaurantId}`,
            "new-order",
            {
              orderId: order.id,
              orderNumber: order.orderNumber,
              totalAmount: order.totalAmount,
            }
          );
        }
      }
    }

    // ======================================================
    // 💳 SUBSCRIPTION CREATED / UPDATED
    // ======================================================
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription;

      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0]?.price?.id || "";
      const plan = PRICE_TO_PLAN[priceId] || "FREE";

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (!user) {
        console.warn("⚠️ User not found for customer:", customerId);
        return NextResponse.json({ received: true });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          plan,
        },
      });
    }

    // ======================================================
    // 🔴 SUBSCRIPTION CANCELLED
    // ======================================================
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.updateMany({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          subscriptionStatus: "canceled",
          plan: "FREE",
        },
      });
    }

    // ======================================================
    // 🧾 PAYMENT FAILED
    // ======================================================
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      await prisma.user.updateMany({
        where: {
          stripeCustomerId: invoice.customer as string,
        },
        data: {
          subscriptionStatus: "past_due",
        },
      });
    }

    // ======================================================
    // 🧾 PAYMENT SUCCEEDED
    // ======================================================
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;

      await prisma.user.updateMany({
        where: {
          stripeCustomerId: invoice.customer as string,
        },
        data: {
          subscriptionStatus: "active",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ WEBHOOK HANDLER ERROR:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}