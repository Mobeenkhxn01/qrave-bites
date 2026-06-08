import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { menuItemId, name, options, priceVariance, isRequired } = await req.json();

    if (!menuItemId || !name || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: "menuItemId, name, and options array required" },
        { status: 400 }
      );
    }

    const modifier = await prisma.itemModifier.create({
      data: {
        menuItemId,
        name,
        options,
        priceVariance: priceVariance || options.map(() => 0),
        isRequired: isRequired || false,
      },
    });

    return NextResponse.json(modifier, { status: 201 });
  } catch (error) {
    console.error("MODIFIER_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = searchParams.get("menuItemId");

    if (!menuItemId) {
      return NextResponse.json([], { status: 200 });
    }

    const modifiers = await prisma.itemModifier.findMany({
      where: { menuItemId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(modifiers);
  } catch (error) {
    console.error("GET_MODIFIERS_ERROR:", error);
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

    const modifier = await prisma.itemModifier.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(modifier);
  } catch (error) {
    console.error("MODIFIER_UPDATE_ERROR:", error);
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

    await prisma.itemModifier.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MODIFIER_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
