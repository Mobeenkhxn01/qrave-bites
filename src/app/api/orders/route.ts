
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ===================== GET ===================== */
export async function GET() {
  try {
    const session = await auth();

    if (session?.user?.role === "ADMIN") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              menuItem: { select: { id: true, name: true } },
            },
          },
        },
      });

      return NextResponse.json({ orders });
    }

    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ orders: [] });

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!restaurant) return NextResponse.json({ orders: [] });

    const orders = await prisma.order.findMany({
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

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===================== POST ===================== */
export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

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

    const restaurantId = cart.cartItems[0].menuItem.restaurantId;

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.menuItem.price,
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
          create: cart.cartItems.map((item) => ({
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
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
