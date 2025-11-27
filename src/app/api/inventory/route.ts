// src/app/api/inventory/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || undefined;
    const category = url.searchParams.get("category") || undefined;

    const where: any = {};
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { supplier: { contains: q, mode: "insensitive" } }];
    if (category) where.category = category;

    const items = await prisma.inventory.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, items });
  } catch (err) {
    console.error("GET /api/inventory error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      category,
      currentStock = 0,
      minStock = 0,
      maxStock = 0,
      unit = "",
      cost = 0,
      supplier = "",
    } = body;

    if (!name || !category) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const item = await prisma.inventory.create({
      data: {
        name,
        category,
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        maxStock: Number(maxStock),
        unit,
        cost: Number(cost),
        supplier,
        lastRestocked: new Date(),
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/inventory error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
