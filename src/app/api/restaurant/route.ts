import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// CREATE Restaurant
export async function POST(req: NextRequest) {
  try {
    const { name, cityId, userID, description, foodType } = await req.json();

    if (!name || !cityId || !userID || !description || !foodType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        foodType,
        user: { connect: { id: userID } },   // ✅ Connect user by ID
        city: { connect: { id: cityId } },   // ✅ Connect city by ID
      },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Error adding new restaurant:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET All Restaurants
export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        city: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE Restaurant
export async function PUT(req: NextRequest) {
  try {
    const { id, name, cityId, userID, description, foodType } = await req.json();

    if (!id || !name || !description || !cityId || !userID || !foodType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name,
        description,
        foodType,
        city: { connect: { id: cityId } },   // ✅ Reconnect city
        user: { connect: { id: userID } },   // ✅ Reconnect user
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE Restaurant
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.restaurant.delete({ where: { id } });

    return NextResponse.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
