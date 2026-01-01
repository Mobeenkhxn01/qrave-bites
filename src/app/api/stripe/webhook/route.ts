import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.MOBEEN_STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.MOBEEN_STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) return NextResponse.json({ received: true });

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { paid: true },
    });

    if (existing?.paid) return NextResponse.json({ received: true });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paid: true,
        status: "CONFIRMED",
      },
    });

    if (order.tableId) {
      await prisma.cart.deleteMany({
        where: { tableId: order.tableId },
      });
    }

    await prisma.notification.create({
      data: {
        restaurantId: order.restaurantId,
        orderId: order.id,
        type: "ORDER_UPDATE",
        message: `Payment received for order #${order.orderNumber}`,
        payload: {
          orderId: order.id,
          paid: true,
        },
      },
    });
  }

  return NextResponse.json({ received: true });
}
