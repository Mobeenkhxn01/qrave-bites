import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.MOBEEN_STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.MOBEEN_STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("WEBHOOK_ERROR", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paid: true,
        status: "CONFIRMED",
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

    pusherServer
      .trigger(`restaurant-${order.restaurantId}`, "new-order", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
      })
      .catch(console.error);
  }

  return NextResponse.json({ received: true });
}

