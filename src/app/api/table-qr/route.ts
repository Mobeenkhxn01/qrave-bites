import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { number, restaurantId } = await req.json();

    if (!number || !restaurantId) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // create table first
    const table = await prisma.table.create({
      data: {
        number,
        restaurantId,
        qrCodeUrl: "",
      },
      include: {
        restaurant: true,
      },
    });

    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${table.id}`;

    await prisma.table.update({
      where: { id: table.id },
      data: { qrCodeUrl },
    });

    return NextResponse.json({ ...table, qrCodeUrl });
  } catch (error) {
    console.error("QR Creation Error:", error);
    return NextResponse.json({ error: "Failed to create QR" }, { status: 500 });
  }
}