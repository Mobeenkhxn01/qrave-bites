import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, userId } = await req.json();
    if (!name || !userId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existing = await prisma.category.findFirst({
      where: { name: name.toLowerCase(), userId }
    });

    if (existing)
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });

    const category = await prisma.category.create({
      data: { name: name.toLowerCase(), userId }
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();
    if (!id || !name)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const conflict = await prisma.category.findFirst({
      where: {
        name: name.toLowerCase(),
        userId: existing.userId,
        NOT: { id }
      }
    });

    if (conflict)
      return NextResponse.json({ error: "Category name already in use" }, { status: 400 });

    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.toLowerCase() }
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const categories = await prisma.category.findMany({
      where: { userId }
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
