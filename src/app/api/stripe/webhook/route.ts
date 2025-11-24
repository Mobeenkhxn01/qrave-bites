import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const restaurantId = session.metadata.restaurantId;
      const tableId = session.metadata.tableId;
      const items = JSON.parse(session.metadata.items);

      const order = await prisma.order.create({
        data: {
          restaurantId,
          tableId,
          totalAmount: session.amount_total / 100,
          paid: true,
          status: "PENDING",
          items: {
            create: items.map((it: any) => ({
              menuItemId: it.menuItemId,
              quantity: it.quantity,
              price: it.price,
            })),
          },
        },
        include: { items: true },
      });

      await pusherServer.trigger(`restaurant-${restaurantId}`, "new-order", {
        orderId: order.id,
        restaurantId,
        tableId,
        totalAmount: order.totalAmount,
        items: order.items,
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
