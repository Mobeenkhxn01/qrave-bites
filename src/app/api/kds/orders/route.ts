import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();

    // ADMIN sees all orders
    if (session?.user?.role === "ADMIN") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: { menuItem: { select: { id: true, name: true } } },
          },
        },
      });
      return NextResponse.json({ orders });
    }

    // For restaurant owners: find their restaurant and return its orders
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ orders: [] });
    }

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!restaurant) return NextResponse.json({ orders: [] });

    const orders = await prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { menuItem: { select: { id: true, name: true } } },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("GET /api/kitchen/orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
