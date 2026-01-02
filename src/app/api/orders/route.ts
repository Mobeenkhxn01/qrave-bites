import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CartItemType = {
  menuItemId: string;
  quantity: number;
  menuItem: {
    price: number;
    restaurantId: string;
  };
};

type OrderItemType = {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    id: string;
    name: string;
  };
};

type OrderType = {
  id: string;
  orderNumber: number;
  tableNumber: number | null;
  totalAmount: number;
  status: string;
  paid: boolean;
  createdAt: Date;
  items: OrderItemType[];
};

/* ===================== GET ORDERS ===================== */
export async function GET() {
  try {
    const session = await auth();

    let orders: OrderType[] = [];

    if (session?.user?.role === "ADMIN") {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              menuItem: { select: { id: true, name: true } },
            },
          },
        },
      });
    } else {
      const userId = session?.user?.id;
      if (!userId) return NextResponse.json([]);

      const restaurant = await prisma.restaurantStep1.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (!restaurant) return NextResponse.json([]);

      orders = await prisma.order.findMany({
        where: { restaurantId: restaurant.id },
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              menuItem: { select: { id: true, name: true } },
            },
          },
        },
      });
    }

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      tableNumber: o.tableNumber,
      totalAmount: o.totalAmount,
      status: o.status,
      paid: o.paid,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price,
        menuItem: i.menuItem,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { tableId, tableNumber, phone } = await req.json();

    if (!tableId) {
      return NextResponse.json({ message: "tableId required" }, { status: 400 });
    }

    const cart = await prisma.cart.findFirst({
      where: { tableId },
      include: {
        cartItems: { include: { menuItem: true } },
        table: true,
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json({ message: "Cart empty" }, { status: 400 });
    }

    const cartItems = cart.cartItems as CartItemType[];
    const restaurantId = cartItems[0].menuItem.restaurantId;

    const totalAmount = cartItems.reduce(
      (sum, i) => sum + i.quantity * i.menuItem.price,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const last = await tx.order.findFirst({
        where: { restaurantId },
        orderBy: { orderNumber: "desc" },
        select: { orderNumber: true },
      });

      return tx.order.create({
        data: {
          restaurantId,
          tableId,
          tableNumber: tableNumber ?? cart.table?.number ?? null,
          userId: session?.user?.id ?? null,
          phone,
          totalAmount,
          orderNumber: (last?.orderNumber ?? 0) + 1,
          paid: false,
          status: "PENDING",
          items: {
            create: cartItems.map((i) => ({
              menuItemId: i.menuItemId,
              quantity: i.quantity,
              price: i.menuItem.price,
            })),
          },
        },
      });
    });

    return NextResponse.json({ success: true, order });
  } catch (e) {
    console.error("ORDER_CREATE_ERROR", e);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

