import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  cartQuerySchema,
  cartItemSchema,
} from "@/lib/validators";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const parsedQuery = cartQuerySchema.safeParse({
    tableId: searchParams.get("tableId") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const { tableId } = parsedQuery.data;

  if (tableId) {
    const cart = await prisma.cart.findFirst({
      where: { tableId },
      include: {
        cartItems: {
          include: { menuItem: true },
        },
      },
    });

    return NextResponse.json(cart ?? { cartItems: [] });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ cartItems: [] });
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: {
      cartItems: {
        include: { menuItem: true },
      },
    },
  });

  return NextResponse.json(cart ?? { cartItems: [] });
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);

  const parsedQuery = cartQuerySchema.safeParse({
    tableId: searchParams.get("tableId") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsedBody = cartItemSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { tableId } = parsedQuery.data;
  const { menuItemId } = parsedBody.data;

  let cart;

  if (tableId) {
    cart = await prisma.cart.findFirst({
      where: { tableId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { tableId },
      });
    }
  } else {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      menuItemId,
    },
  });

  if (existingItem) {
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } },
      include: { menuItem: true },
    });

    return NextResponse.json(updated);
  }

  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      menuItemId,
      quantity: 1,
    },
    include: { menuItem: true },
  });

  return NextResponse.json(newItem);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);

  const parsedQuery = cartQuerySchema.safeParse({
    tableId: searchParams.get("tableId") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsedBody = cartItemSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { tableId } = parsedQuery.data;
  const { menuItemId } = parsedBody.data;

  let cart;

  if (tableId) {
    cart = await prisma.cart.findFirst({
      where: { tableId },
      include: { cartItems: true },
    });
  } else {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { cartItems: true },
    }
    );
  }

  if (!cart) {
    return NextResponse.json({ success: true });
  }

  const item = cart.cartItems.find(
    (i) => i.menuItemId === menuItemId
  );

  if (!item) {
    return NextResponse.json({ success: true });
  }

  if (item.quantity > 1) {
    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: { decrement: 1 } },
      include: { menuItem: true },
    });

    return NextResponse.json(updated);
  }

  await prisma.cartItem.delete({
    where: { id: item.id },
  });

  return NextResponse.json({ success: true });
}
