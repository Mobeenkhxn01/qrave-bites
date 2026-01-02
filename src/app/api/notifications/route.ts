import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json([], { status: 200 });
    }

    const { searchParams } = new URL(req.url);

    const restaurantId = searchParams.get("restaurantId");
    const unread = searchParams.get("unread");
    const take = Number(searchParams.get("take") || 20);

    if (!restaurantId) {
      return NextResponse.json([], { status: 200 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        restaurantId,
        ...(unread === "true" ? { isRead: false } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /notifications error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      restaurantId,
      message,
      type,
      orderId,
      payload,
    } = body;

    if (!restaurantId || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        restaurantId,
        message,
        type,
        orderId,
        payload,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("POST /notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
