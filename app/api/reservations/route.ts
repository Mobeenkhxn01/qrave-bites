import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      restaurantId,
      customerName,
      customerPhone,
      customerEmail,
      numberOfGuests,
      reservationTime,
      notes,
      tableId,
    } = await req.json();

    if (!restaurantId || !customerName || !customerPhone || !numberOfGuests || !reservationTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check table availability if specified
    if (tableId) {
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          tableId,
          status: "confirmed",
          reservationTime: {
            gte: new Date(new Date(reservationTime).getTime() - 60 * 60 * 1000), // 1 hour before
            lte: new Date(new Date(reservationTime).getTime() + 120 * 60 * 1000), // 2 hours after
          },
        },
      });

      if (existingReservation) {
        return NextResponse.json(
          { error: "Table not available for this time" },
          { status: 400 }
        );
      }
    }

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        numberOfGuests,
        reservationTime: new Date(reservationTime),
        notes: notes || null,
        tableId: tableId || null,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("RESERVATION_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const status = searchParams.get("status");

    if (!restaurantId) {
      return NextResponse.json([], { status: 200 });
    }

    const whereClause: any = { restaurantId };
    if (status) {
      whereClause.status = status;
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: { table: true },
      orderBy: { reservationTime: "asc" },
      take: 100,
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("GET_RESERVATIONS_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("RESERVATION_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
