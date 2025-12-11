import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

type RouteParams = Promise<{ id: string }>;

export async function PUT(
  req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: itemId } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

    const orderItem = await prisma.orderItem
      .update({
        where: { id: itemId },
        data: {
          status, // ✅ this assumes status exists in your Prisma schema
        },
      })
      .catch(() => null);

    if (!orderItem) {
      return NextResponse.json(
        {
          error:
            "OrderItem status field not implemented. Add `status` to OrderItem model.",
        },
        { status: 501 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderItem.orderId },
    });

    try {
      await pusherServer.trigger(
        `restaurant-${order?.restaurantId}`,
        "order-item-update",
        { item: orderItem }
      );

      await pusherServer.trigger("kitchen-global", "orders-updated", {});
    } catch (e) {
      console.warn("Pusher trigger failed:", e);
    }

    return NextResponse.json({ item: orderItem });
  } catch (err) {
    console.error("PUT /api/kitchen/items/[id] error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
