import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { number, qrCodeUrl } = await req.json();
    if (typeof number !== "number" || !qrCodeUrl) {
      return NextResponse.json(
        { error: "Missing or invalid data" },
        { status: 400 }
      );
    }

    const table = await prisma.table.create({
      data: {
        number,
        qrCodeUrl,
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error("❌ Prisma Error:", error);
    return NextResponse.json({ error: "Failed to save QR" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tables);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch QR codes" },
      { status: 500 }
    );
  }
}
