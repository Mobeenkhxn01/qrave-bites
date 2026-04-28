import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const city = url.searchParams.get("city");
    const tableId = url.searchParams.get("tableId");

    if (!slug || !city) {
      return NextResponse.json(
        { message: "city and slug are required" },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurantStep1.findUnique({
      where: { slug },
      select: {
        id: true,
        restaurantName: true,
        city: true,
        area: true,
        address: true,
      },
    });

    if (!restaurant || decodeURIComponent(restaurant.city) !== decodeURIComponent(city)) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    let tableNumber: number | null = null;

    if (tableId) {
      const table = await prisma.table.findUnique({
        where: { id: tableId },
        select: {
          number: true,
          restaurantId: true,
        },
      });

      if (!table || table.restaurantId !== restaurant.id) {
        return NextResponse.json({ message: "Invalid table" }, { status: 400 });
      }

      tableNumber = table.number;
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ available: "desc" }, { name: "asc" }],
    });

    return NextResponse.json({
      restaurant,
      tableNumber,
      menuItems,
    });
  } catch (error) {
    console.error("RESTAURANT_MENU_FETCH_ERROR", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
