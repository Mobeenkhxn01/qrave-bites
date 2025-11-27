import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const restaurantId = session.metadata.restaurantId;
    const tableNumber = Number(session.metadata.tableNumber);
    const cartId = session.metadata.cartId;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: { include: { menuItem: true } } },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 400 });
    }

    const lastOrder = await prisma.order.findFirst({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
    });

    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableNumber,
        totalAmount: (session.amount_total || 0) / 100,
        paid: true,
        status: "PENDING",
        orderNumber,
        items: {
          create: cart.cartItems.map((i: any) => ({
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
      tableNumber,
      totalAmount: order.totalAmount,
      items: order.items,
    });

    await prisma.cart.delete({ where: { id: cartId } });
  }

  return NextResponse.json({ received: true });
}
