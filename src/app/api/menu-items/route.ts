import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, description, price, image, categoryId, prepTime, available } = data;

    if (!name || !description || price === undefined || !categoryId || prepTime === undefined || available === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId }
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const conflict = await prisma.menuItem.findFirst({
      where: { name: name.toLowerCase(), userId }
    });

    if (conflict) {
      return NextResponse.json({ error: "Menu item already exists" }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name: name.toLowerCase(),
        description,
        image,
        price: parsedPrice,
        prepTime,
        available,
        userId,
        categoryId,
        restaurantId: restaurant.id
      }
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const items = await prisma.menuItem.findMany({
      where: { userId }
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, name, description, price, image, categoryId, prepTime, available } = data;

    if (!id || !name || !description || price === undefined || !categoryId || prepTime === undefined || available === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const existing = await prisma.menuItem.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    const conflict = await prisma.menuItem.findFirst({
      where: { name: name.toLowerCase(), userId, id: { not: id } }
    });

    if (conflict) {
      return NextResponse.json({ error: "Menu item already exists" }, { status: 400 });
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        name: name.toLowerCase(),
        description,
        price: parsedPrice,
        image,
        categoryId,
        prepTime,
        available
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const existing = await prisma.menuItem.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({ where: { menuItemId: id } });
    await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
