import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ restaurantId: null });
    }

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    return NextResponse.json({
      restaurantId: restaurant?.id || null,
    });
  } catch {
    return NextResponse.json(
      { restaurantId: null },
      { status: 500 }
    );
  }
}
