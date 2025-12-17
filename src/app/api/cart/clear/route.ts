import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
  categoryDeleteSchema,
} from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, userId } = parsed.data;

    const existing = await prisma.category.findFirst({
      where: { name: name.toLowerCase(), userId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name: name.toLowerCase(), userId },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { id, name } = parsed.data;

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const conflict = await prisma.category.findFirst({
      where: {
        name: name.toLowerCase(),
        userId: existing.userId,
        NOT: { id },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Category name already in use" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.toLowerCase() },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const parsedQuery = categoryQuerySchema.safeParse({
      userId: url.searchParams.get("userId"),
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { userId } = parsedQuery.data;

    const categories = await prisma.category.findMany({
      where: { userId },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);

    const parsedQuery = categoryDeleteSchema.safeParse({
      id: url.searchParams.get("id"),
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { id } = parsedQuery.data;

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
