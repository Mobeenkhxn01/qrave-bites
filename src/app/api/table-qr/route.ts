import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

// ---------------------------
// CREATE TABLE + GENERATE QR
// ---------------------------
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "RESTAURANT_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { number } = await req.json();
    if (!number) {
      return NextResponse.json({ error: "Table number required" }, { status: 400 });
    }

    // 1️⃣ Find the restaurant of this owner/admin
    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // 2️⃣ Create table (unique ObjectId auto-generated)
    const table = await prisma.table.create({
      data: {
        number,
        qrCodeUrl: "",
        restaurantId: restaurant.id,
      },
    });

    // 3️⃣ Build QR URL on backend
    const qrLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/qr-codes/${table.id}`;

    // 4️⃣ Generate QR image (base64)
    const qrCodeUrl = await QRCode.toDataURL(qrLink);

    // 5️⃣ Save QR image URL
    const updatedTable = await prisma.table.update({
      where: { id: table.id },
      data: { qrCodeUrl },
    });

    return NextResponse.json(updatedTable, { status: 201 });

  } catch (error) {
    console.error("TABLE CREATE ERROR", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    // ADMIN or OWNER allowed
    if (session.user.role !== "ADMIN" && session.user.role !== "RESTAURANT_OWNER") {
      return NextResponse.json([], { status: 200 });
    }

    // Find restaurant for owner
    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch tables
    const tables = await prisma.table.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { number: "asc" },
    });

    return NextResponse.json(tables, { status: 200 });

  } catch (error) {
    console.error("GET TABLE ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}