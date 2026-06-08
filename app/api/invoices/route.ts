import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { menuItem: true, modifiers: true } },
        restaurant: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { orderId },
    });

    if (existingInvoice) {
      return NextResponse.json(existingInvoice);
    }

    // Calculate invoice totals
    let subtotal = 0;
    const itemsSerialized = order.items.map((item) => ({
      id: item.id,
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
      modifiers: item.modifiers,
    }));

    subtotal = itemsSerialized.reduce((sum, item) => sum + item.total, 0);

    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
    const discount = 0;
    const totalAmount = subtotal + tax - discount;

    // Generate invoice number
    const invoiceNumber = `INV-${order.restaurantId.slice(0, 4)}-${Date.now()}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        subtotal,
        tax,
        discount,
        totalAmount,
        items: JSON.stringify(itemsSerialized),
        paymentMethod: order.paymentMethod,
        isPaid: order.paid,
        paidAt: order.paid ? new Date() : null,
        orderId,
        restaurantId: order.restaurantId,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("INVOICE_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const orderId = searchParams.get("orderId");

    if (orderId) {
      const invoice = await prisma.invoice.findUnique({
        where: { orderId },
      });
      return NextResponse.json(invoice || {});
    }

    if (restaurantId) {
      const invoices = await prisma.invoice.findMany({
        where: { restaurantId },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return NextResponse.json(invoices);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("GET_INVOICES_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
