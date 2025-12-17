import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { orderQuerySchema } from "@/lib/validators";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);

  const parsedQuery = orderQuerySchema.safeParse({
    _id: url.searchParams.get("_id") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const orderId = parsedQuery.data._id;
  const role = session.user.role;
  const userId = session.user.id;

  try {
    if (role === "ADMIN") {
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: { include: { menuItem: true } },
            restaurant: true,
          },
        });

        if (!order) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
      }

      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { menuItem: true } },
          restaurant: true,
        },
      });

      return NextResponse.json(orders);
    }

    const restaurant = await prisma.restaurantStep1.findUnique({
      where: { userId },
    });

    if (!restaurant) {
      return NextResponse.json([]);
    }

    const restaurantId = restaurant.id;

    if (orderId) {
      const order = await prisma.order.findFirst({
        where: { id: orderId, restaurantId },
        include: {
          items: { include: { menuItem: true } },
          restaurant: true,
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json(order);
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
      },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
