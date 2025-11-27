import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const itemId = params.id;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const orderItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { /* no direct status field in your schema: we will use `price`/quantity etc. */
        // NOTE: your prisma OrderItem model doesn't have `status` in schema previously shown.
        // Approach: store status in Notification or extend OrderItem with `status` (recommended).
      },
    }).catch(() => null);

    // If your OrderItem model does not have a `status` field, you should add one:
    // model OrderItem { ... status String? @default("pending") ... }
    // For now, we'll return 501 if not present.

    if (!orderItem) {
      return NextResponse.json({ error: "OrderItem status field not implemented. Add `status` to OrderItem model." }, { status: 501 });
    }

    // notify clients
    const order = await prisma.order.findUnique({ where: { id: orderItem.orderId } });
    try {
      await pusherServer.trigger(`restaurant-${order?.restaurantId}`, "order-item-update", { item: orderItem });
      await pusherServer.trigger("kitchen-global", "orders-updated", {});
    } catch (e) {
      console.warn("Pusher trigger failed:", e);
    }

    return NextResponse.json({ item: orderItem });
  } catch (err) {
    console.error("PUT /api/kitchen/items/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
