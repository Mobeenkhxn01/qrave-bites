import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

export async function PUT(req: Request, { params }: { params: RouteParams }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: any = {};
    const fields = [
      "name",
      "category",
      "currentStock",
      "minStock",
      "maxStock",
      "unit",
      "cost",
      "supplier",
    ];

    fields.forEach((f) => {
      if (body[f] !== undefined) data[f] = body[f];
    });

    if (data.currentStock !== undefined) {
      data.lastRestocked = new Date();
    }

    const updated = await prisma.inventory.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    console.error("PUT /api/inventory/[id] error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;

    await prisma.inventory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/inventory/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
