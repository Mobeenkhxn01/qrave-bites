import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia"
});

export async function POST(req: Request) {
  try {
    const { tableNumber } = await req.json();

    if (!tableNumber)
      return NextResponse.json({ error: "Missing tableNumber" }, { status: 400 });

    const cart = await prisma.cart.findFirst({
      where: { tableNumber: Number(tableNumber) },
      include: { cartItems: { include: { menuItem: true } } }
    });

    if (!cart)
      return NextResponse.json({ error: "No cart found" }, { status: 400 });

    if (cart.cartItems.length === 0)
      return NextResponse.json({ error: "Cart empty" }, { status: 400 });

    const restaurantId = cart.cartItems[0].menuItem.restaurantId;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.cartItems.map((i) => ({
        price_data: {
          currency: "inr",
          product_data: { name: i.menuItem.name },
          unit_amount: Math.round(i.menuItem.price * 100)
        },
        quantity: i.quantity
      })),
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
      metadata: {
        restaurantId,
        tableNumber: String(tableNumber),
        cartId: cart.id
      }
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout error" }, { status: 500 });
  }
}
