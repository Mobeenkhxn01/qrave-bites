import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch orders from the last 90 days
    const recentOrders = await prisma.order.findMany({
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

    // Group by date and sum revenue
    const revenueMap: Record<string, number> = {};

    recentOrders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      revenueMap[date] = (revenueMap[date] || 0) + order.totalAmount;
    });

    // Convert to chart-friendly format
    const chartData = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Revenue analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
