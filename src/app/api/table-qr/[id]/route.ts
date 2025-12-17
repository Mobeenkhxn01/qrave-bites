import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { tableId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "RESTAURANT_OWNER"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const table = await prisma.table.findUnique({
      where: { id: params.tableId },
      include: {
        restaurant: {
          select: {
            id: true,
            userId: true,
            restaurantName: true,
          },
        },
      },
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    if (
      session.user.role !== "ADMIN" &&
      table.restaurant.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(table, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
