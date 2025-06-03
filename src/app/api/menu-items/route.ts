import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, price, image, categoryId } = await req.json();

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Auto-fetch restaurant for user
    const restaurant = await prisma.restaurant.findFirst({ where: { userId } });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found for user" }, { status: 404 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        image,
        price,
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        restaurant: { connect: { id: restaurant.id } },
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const menuItem = await prisma.menuItem.findMany();
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description, price, image, categoryId } = await req.json();

    if (!id || !name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findFirst({ where: { userId } });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found for user" }, { status: 404 });
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        image,
        price,
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        restaurant: { connect: { id: restaurant.id } },
      },
    });

    return NextResponse.json(updatedMenuItem, { status: 200 });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
