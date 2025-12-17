import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const restaurantId = session.metadata.restaurantId;
    const tableId = session.metadata.tableId;
    const cartId = session.metadata.cartId;

    const existing = await prisma.order.findFirst({
      where: { stripeSessionId: session.id },
    });

    if (existing) {
      return NextResponse.json({ received: true });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: { include: { menuItem: true } } },
    });

    if (!cart || cart.tableId !== tableId || cart.cartItems.length === 0) {
      return NextResponse.json({ received: true });
    }

    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      return NextResponse.json({ received: true });
    }

    const lastOrder = await prisma.order.findFirst({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
    });

    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableId,
        tableNumber: table.number,
        totalAmount: (session.amount_total ?? 0) / 100,
        paid: true,
        status: "PENDING",
        orderNumber,
        stripeSessionId: session.id,
        items: {
          create: cart.cartItems.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            price: i.menuItem.price,
          })),
        },
      },
      include: { items: true },
    });

    await pusherServer.trigger(`restaurant-${restaurantId}`, "new-order", {
      orderId: order.id,
      orderNumber,
      tableNumber: table.number,
      totalAmount: order.totalAmount,
      items: order.items,
    });

    await prisma.cartItem.deleteMany({ where: { cartId } });
    await prisma.cart.deleteMany({
      where: {
        id: cartId,
        tableId,
      },
    });
  }

  return NextResponse.json({ received: true });
}
