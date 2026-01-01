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
