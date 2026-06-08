import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { tableId, restaurantId, reason } = await req.json();

    if (!tableId || !restaurantId) {
      return NextResponse.json(
        { error: "tableId and restaurantId required" },
        { status: 400 }
      );
    }

    const waiterCall = await prisma.waiterCall.create({
      data: {
        tableId,
        restaurantId,
        reason: reason || "Service",
      },
    });

    return NextResponse.json(waiterCall, { status: 201 });
  } catch (error) {
    console.error("WAITER_CALL_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const resolved = searchParams.get("resolved");

    if (!restaurantId) {
      return NextResponse.json([], { status: 200 });
    }

    const whereClause: any = { restaurantId };
    if (resolved === "false") {
      whereClause.resolved = false;
    }

    const calls = await prisma.waiterCall.findMany({
      where: whereClause,
      include: { table: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(calls);
  } catch (error) {
    console.error("GET_WAITER_CALLS_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, resolved } = await req.json();

    const waiterCall = await prisma.waiterCall.update({
      where: { id },
      data: {
        resolved,
        resolvedAt: resolved ? new Date() : null,
      },
    });

    return NextResponse.json(waiterCall);
  } catch (error) {
    console.error("WAITER_CALL_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
