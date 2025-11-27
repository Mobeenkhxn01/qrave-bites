import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get("table");

  if (table) {
    const cart = await prisma.cart.findFirst({
      where: { tableNumber: Number(table) },
      include: { cartItems: { include: { menuItem: true } } },
    });
    return NextResponse.json(cart || { cartItems: [] });
  }

  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { cartItems: { include: { menuItem: true } } },
  });

  return NextResponse.json(cart || { cartItems: [] });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get("table");
  const { menuItemId } = await req.json();

  if (!menuItemId)
    return NextResponse.json({ error: "menuItemId required" }, { status: 400 });

  if (table) {
    let cart = await prisma.cart.findFirst({
      where: { tableNumber: Number(table) },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { tableNumber: Number(table) },
      });
    }

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, menuItemId },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + 1 },
        include: { menuItem: true },
      });
      return NextResponse.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: { cartId: cart.id, menuItemId, quantity: 1 },
      include: { menuItem: true },
    });

    return NextResponse.json(newItem);
  }

  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, menuItemId },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
      include: { menuItem: true },
    });
    return NextResponse.json(updated);
  }

  const newItem = await prisma.cartItem.create({
    data: { cartId: cart.id, menuItemId, quantity: 1 },
    include: { menuItem: true },
  });

  return NextResponse.json(newItem);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get("table");
  const { menuItemId } = await req.json();

  if (!menuItemId)
    return NextResponse.json({ error: "menuItemId required" }, { status: 400 });

  if (table) {
    const cart = await prisma.cart.findFirst({
      where: { tableNumber: Number(table) },
      include: { cartItems: true },
    });

    if (!cart)
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = cart.cartItems.find((i) => i.menuItemId === menuItemId);
    if (!item)
      return NextResponse.json({ error: "Item not in cart" }, { status: 404 });

    if (item.quantity > 1) {
      const updated = await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: item.quantity - 1 },
        include: { menuItem: true },
      });
      return NextResponse.json(updated);
    }

    await prisma.cartItem.delete({ where: { id: item.id } });
    return NextResponse.json({ success: true });
  }

  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { cartItems: true },
  });

  if (!cart)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.cartItems.find((i) => i.menuItemId === menuItemId);
  if (!item)
    return NextResponse.json({ error: "Item not in cart" }, { status: 404 });

  if (item.quantity > 1) {
    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: item.quantity - 1 },
      include: { menuItem: true },
    });
    return NextResponse.json(updated);
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
  return NextResponse.json({ success: true });
}
