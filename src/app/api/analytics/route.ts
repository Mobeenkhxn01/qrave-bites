import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const restaurant = await prisma.restaurantStep1.findUnique({
      where: { userId },
    });

    if (!restaurant)
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

    const restaurantId = restaurant.id;

    const totalRevenue = await prisma.order.aggregate({
      where: { restaurantId, paid: true },
      _sum: { totalAmount: true },
    });

    const totalOrders = await prisma.order.count({
      where: { restaurantId },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = await prisma.order.count({
      where: { restaurantId, createdAt: { gte: today } },
    });

    const qrScans = await prisma.table.aggregate({
      where: { restaurantId },
      _sum: { scan: true },
    });

    const notifications = await prisma.notification.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      revenue: totalRevenue._sum.totalAmount || 0,
      totalOrders,
      todaysOrders,
      qrScans: qrScans._sum.scan || 0,
      notifications,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
