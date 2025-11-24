import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { number, restaurantId } = await req.json();

    if (!number || !restaurantId) {
      return NextResponse.json(
        { success: false, message: "Missing required data" },
        { status: 400 }
      );
    }

    const table = await prisma.table.create({
      data: {
        number,
        restaurantId,
        qrCodeUrl: "",
      },
    });

    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${table.id}?restaurantId=${restaurantId}`;

    await prisma.table.update({
      where: { id: table.id },
      data: { qrCodeUrl },
    });

    return NextResponse.json({
      success: true,
      data: { ...table, qrCodeUrl },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create QR" },
      { status: 500 }
    );
  }
}
