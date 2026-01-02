import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  orderId: string;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID missing" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          menuItem: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
      table: true,
      restaurant: true,
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  
  try {
    const { orderId } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[ORDER_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

