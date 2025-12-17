import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  inventoryIdParamSchema,
  inventoryUpdateSchema,
} from "@/lib/validators";

type RouteParams = Promise<{ id: string }>;

export async function PUT(req: Request, { params }: { params: RouteParams }) {
  try {
    const parsedParams = inventoryIdParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsedBody = inventoryUpdateSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const data: any = { ...parsedBody.data };

    if (data.currentStock !== undefined) {
      data.lastRestocked = new Date();
    }

    const updated = await prisma.inventory.update({
      where: { id: parsedParams.data.id },
      data,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
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
    const parsedParams = inventoryIdParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    await prisma.inventory.delete({
      where: { id: parsedParams.data.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
