import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.MOBEEN_STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } } },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.AUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.AUTH_URL}/cart`,
      line_items: order.items.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: "inr",
          unit_amount: Math.round(i.price * 100),
          product_data: { name: i.menuItem.name },
        },
      })),
      metadata: {
        orderId: order.id,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("CHECKOUT_ERROR", e);
    return NextResponse.json({ message: "Checkout failed" }, { status: 500 });
  }
}

