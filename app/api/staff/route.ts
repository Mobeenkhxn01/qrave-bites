import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, email, role } = await req.json();

    if (!name || !phone || !role) {
      return NextResponse.json(
        { error: "name, phone, and role required" },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        phone,
        email: email || null,
        role,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("STAFF_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json([], { status: 200 });
    }

    const staff = await prisma.staff.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("GET_STAFF_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updateData } = await req.json();

    const staff = await prisma.staff.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("STAFF_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    await prisma.staff.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("STAFF_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
