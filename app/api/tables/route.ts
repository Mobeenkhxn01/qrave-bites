import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const action = searchParams.get("action");

    if (!restaurantId) {
      return NextResponse.json([], { status: 200 });
    }

    if (action === "dashboard") {
      const tables = await prisma.table.findMany({
        where: { restaurantId },
        include: {
          orders: {
            where: { status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { number: "asc" },
      });

      return NextResponse.json(tables);
    }

    const tables = await prisma.table.findMany({
      where: { restaurantId },
      orderBy: { number: "asc" },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error("GET_TABLES_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, action } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Table ID required" }, { status: 400 });
    }

    if (action === "markOccupied") {
      const table = await prisma.table.update({
        where: { id },
        data: {
          status: "OCCUPIED",
          lastOccupied: new Date(),
        },
      });

      return NextResponse.json(table);
    }

    if (action === "markAvailable") {
      const table = await prisma.table.update({
        where: { id },
        data: {
          status: "AVAILABLE",
        },
      });

      return NextResponse.json(table);
    }

    if (action === "markCleaning") {
      const table = await prisma.table.update({
        where: { id },
        data: {
          status: "CLEANING",
        },
      });

      return NextResponse.json(table);
    }

    if (status) {
      const table = await prisma.table.update({
        where: { id },
        data: { status },
      });

      return NextResponse.json(table);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("UPDATE_TABLE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
