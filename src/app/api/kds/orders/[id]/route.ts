import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });

    // trigger pusher to notify clients (restaurant channel)
    const restaurantId = updated.restaurantId;
    try {
      await pusherServer.trigger(`restaurant-${restaurantId}`, "order-update", { order: updated });
      await pusherServer.trigger("kitchen-global", "orders-updated", { orderId: updated.id });
    } catch (e) {
      console.warn("Pusher trigger failed:", e);
    }

    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error("PUT /api/kitchen/orders/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
