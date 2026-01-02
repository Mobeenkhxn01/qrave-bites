import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RevenueOrder = {
  createdAt: Date;
  totalAmount: number;
};

export async function GET() {
  try {
    const recentOrders: RevenueOrder[] = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const revenueMap: Record<string, number> = {};

    recentOrders.forEach((order: RevenueOrder) => {
      const date = order.createdAt.toISOString().split("T")[0];
      revenueMap[date] = (revenueMap[date] || 0) + order.totalAmount;
    });

    const chartData = Object.entries(revenueMap).map(
      ([date, revenue]) => ({
        date,
        revenue,
      })
    );

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Revenue analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
