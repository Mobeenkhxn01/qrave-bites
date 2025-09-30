import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ---------------------- CREATE MENU ITEM ----------------------
export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, price, image, categoryId, prepTime, available } = await req.json();

    if (!name || !description || !price || !categoryId || !prepTime || !available) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure price is a number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
    }

    // Fetch user's restaurant
    const restaurant = await prisma.restaurantStep1.findFirst({ where: { userId } });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found for user" }, { status: 404 });
    }

    // Check for duplicate menu item name for this user
    const conflictMenuItem = await prisma.menuItem.findFirst({
      where: { name, userId }
    });
    if (conflictMenuItem) {
      return NextResponse.json(
        { error: "Menu item with this name already exists" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        image,
        price: parsedPrice,
        prepTime,
        available,
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        restaurantStep1: { connect: { id: restaurant.id } },
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ---------------------- GET MENU ITEMS ----------------------
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId query parameter" },
        { status: 400 }
      );
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { userId },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ---------------------- UPDATE MENU ITEM ----------------------
export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description, price, image, categoryId , prepTime, available} = await req.json();

    if (!id || !name || !description || !price || !categoryId || !prepTime || !available) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
    }

    // Ensure the menu item belongs to this user
    const existingMenuItem = await prisma.menuItem.findFirst({ where: { id, userId } });
    if (!existingMenuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // Check for duplicate name
    const conflictMenuItem = await prisma.menuItem.findFirst({
      where: { 
        name,
        userId,
        id: { not: id },
      },
    });
    if (conflictMenuItem) {
      return NextResponse.json(
        { error: "Menu item with this name already exists" },
        { status: 400 }
      );
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: parsedPrice,
        image,
        categoryId,
        prepTime,
        available,
      },
    });

    return NextResponse.json(updatedMenuItem, { status: 200 });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id query parameter" },
        { status: 400 }
      );
    }

    // 1️⃣ Ensure the menu item belongs to the user
    const existingMenuItem = await prisma.menuItem.findFirst({ where: { id, userId } });
    if (!existingMenuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // 2️⃣ Delete related CartItems first
    await prisma.cartItem.deleteMany({
      where: { menuItemId: id },
    });

    // 3️⃣ Now safely delete the MenuItem
    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

