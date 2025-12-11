import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

type RouteParams = Promise<{ id: string }>;

export async function PATCH(
  req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id: orderId } = await params; // ✅ FIX HERE

    const body = await req.json();
    const { status, paid } = body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        paid: typeof paid === "boolean" ? paid : undefined,
      },
      include: {
        items: {
          include: { menuItem: true },
        },
        restaurant: true,
      },
    });

    const restaurantId = order.restaurantId;

    await prisma.notification.create({
      data: {
        restaurantId,
        message: `Order ${order.orderNumber} status changed to ${status}`,
        type: "ORDER_UPDATE",
        orderId: order.id,
        payload: { status },
      },
    });

    await pusherServer.trigger(
      `restaurant-${restaurantId}`,
      "order-update",
      { order }
    );

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
