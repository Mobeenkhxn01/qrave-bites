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

    const formatted = orders.map((o: OrderType) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      tableNumber: o.tableNumber ?? null,
      totalAmount: o.totalAmount,
      status: o.status,
      paid: o.paid,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i: OrderItemType) => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price,
        menuItem: i.menuItem,
      })),
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body: {
      tableId?: string;
      tableNumber?: number;
      phone?: string;
    } = await req.json();

    const { tableId, tableNumber, phone } = body;

    if (!tableId) {
      return NextResponse.json(
        { success: false, message: "tableId is required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findFirst({
      where: { tableId },
      include: {
        cartItems: {
          include: { menuItem: true },
        },
        table: true,
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const cartItems = cart.cartItems as CartItemType[];

    const restaurantId = cartItems[0].menuItem.restaurantId;

    const totalAmount = cartItems.reduce(
      (sum: number, item: CartItemType) =>
        sum + item.quantity * item.menuItem.price,
      0
    );

    const lastOrder = await prisma.order.findFirst({
      where: { restaurantId },
      orderBy: { orderNumber: "desc" },
      select: { orderNumber: true },
    });

    const nextOrderNumber = (lastOrder?.orderNumber ?? 0) + 1;

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableId,
        tableNumber: tableNumber ?? cart.table?.number ?? null,
        userId: session?.user?.id ?? null,
        phone: phone ?? null,
        totalAmount,
        orderNumber: nextOrderNumber,
        status: "PENDING",
        paid: false,
        items: {
          create: cartItems.map((item: CartItemType) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.menuItem.price,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.notification.create({
      data: {
        restaurantId,
        orderId: order.id,
        type: "NEW_ORDER",
        message: `New order #${order.orderNumber} received`,
        payload: {
          orderId: order.id,
          tableNumber: order.tableNumber,
          totalAmount,
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
