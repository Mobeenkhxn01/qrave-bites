import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import {
  orderStatusSchema,
  orderIdParamSchema,
} from "@/lib/validators";

type RouteParams = Promise<{ id: string }>;

export async function PATCH(
  req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedParams = orderIdParamSchema.safeParse(await params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Invalid order id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsedBody = orderStatusSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { id: orderId } = parsedParams.data;
    const { status, paid } = parsedBody.data;

    if (session.user.role !== "ADMIN") {
      const restaurant = await prisma.restaurantStep1.findUnique({
        where: { userId: session.user.id },
      });

      if (!restaurant) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const orderCheck = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!orderCheck || orderCheck.restaurantId !== restaurant.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        paid,
      },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
      },
    });

    await prisma.notification.create({
      data: {
        restaurantId: order.restaurantId,
        orderId: order.id,
        type: "ORDER_UPDATE",
        message: `Order ${order.orderNumber} status changed to ${status}`,
        payload: { status },
      },
    });

    await pusherServer.trigger(
      `restaurant-${order.restaurantId}`,
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
