import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.MOBEEN_STRIPE_SECRET_KEY!);

type OrderItemType = {
  quantity: number;
  price: number;
  menuItem: {
    name: string;
  };
};

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.AUTH_URL}/payment/success?orderId=${order.id}`,
      cancel_url: `${process.env.AUTH_URL}`,
      line_items: order.items.map((item: OrderItemType) => ({
        quantity: item.quantity,
        price_data: {
          currency: "inr",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.menuItem.name,
          },
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
  } catch {
    return NextResponse.json(
      { message: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
