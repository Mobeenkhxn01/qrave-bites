// app/api/stripe/webhook/route.ts
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

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
        console.error("WEBHOOK: cart not found", cartId);
        return NextResponse.json({ error: "Cart not found" }, { status: 400 });
      }

      // next order number
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

      // publish to pusher channel for restaurant
      await pusherServer.trigger(`restaurant-${restaurantId}`, "new-order", {
        orderId: order.id,
        orderNumber,
        tableNumber,
        totalAmount: order.totalAmount,
        items: order.items,
      });

      // clear cart
      await prisma.cart.delete({ where: { id: cartId } });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
