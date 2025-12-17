import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  inventoryQuerySchema,
  inventoryCreateSchema,
} from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const parsedQuery = inventoryQuerySchema.safeParse({
      q: url.searchParams.get("q") ?? undefined,
      category: url.searchParams.get("category") ?? undefined,
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { success: false, message: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { q, category } = parsedQuery.data;

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { supplier: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const items = await prisma.inventory.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, items });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = inventoryCreateSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      name,
      category,
      currentStock = 0,
      minStock = 0,
      maxStock = 0,
      unit = "",
      cost = 0,
      supplier = "",
    } = parsedBody.data;

    const item = await prisma.inventory.create({
      data: {
        name,
        category,
        currentStock,
        minStock,
        maxStock,
        unit,
        cost,
        supplier,
        lastRestocked: new Date(),
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
