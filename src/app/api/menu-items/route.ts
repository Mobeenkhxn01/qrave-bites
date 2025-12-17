import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
  menuItemQuerySchema,
  menuItemDeleteSchema,
} from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createMenuItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, description, price, image, categoryId, prepTime, available } =
      parsed.data;

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const conflict = await prisma.menuItem.findFirst({
      where: { name: name.toLowerCase(), userId },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Menu item already exists" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name: name.toLowerCase(),
        description,
        image,
        price,
        prepTime,
        available,
        userId,
        categoryId,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const parsedQuery = menuItemQuerySchema.safeParse({
      userId: url.searchParams.get("userId"),
    });

    if (!parsedQuery.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const items = await prisma.menuItem.findMany({
      where: { userId: parsedQuery.data.userId },
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateMenuItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const {
      id,
      name,
      description,
      price,
      image,
      categoryId,
      prepTime,
      available,
    } = parsed.data;

    const existing = await prisma.menuItem.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    const conflict = await prisma.menuItem.findFirst({
      where: { name: name.toLowerCase(), userId, id: { not: id } },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Menu item already exists" },
        { status: 400 }
      );
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        name: name.toLowerCase(),
        description,
        price,
        image,
        categoryId,
        prepTime,
        available,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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
    const parsedQuery = menuItemDeleteSchema.safeParse({
      id: url.searchParams.get("id"),
    });

    if (!parsedQuery.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const { id } = parsedQuery.data;

    const existing = await prisma.menuItem.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.deleteMany({ where: { menuItemId: id } });
    await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
