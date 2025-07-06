// /app/api/restaurants/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const restaurants = await prisma.restaurantStep1.findMany({
      select: {
        id: true,
        restaurantName: true,
        slug: true,
        city: true,
        area: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
