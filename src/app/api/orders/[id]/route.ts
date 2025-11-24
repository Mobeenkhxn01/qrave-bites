import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const body = await req.json();
    const { status, paid } = body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        paid: typeof paid === "boolean" ? paid : undefined,
      },
      include: { items: true },
    });

    if (order.tableId) {
      await pusherServer.trigger(
        `table-${order.tableId}`,
        "order-update",
        { order }
      );
    }

    await prisma.notification.create({
      data: {
        restaurantId: order.tableId ? (await prisma.table.findUnique({ where: { id: order.tableId } }))?.restaurantId! : "",
        message: `Order ${order.id} status changed to ${status}`,
        type: "ORDER_UPDATE",
        orderId: order.id,
        payload: { status },
      },
    }).catch(() => undefined);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("update order error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
