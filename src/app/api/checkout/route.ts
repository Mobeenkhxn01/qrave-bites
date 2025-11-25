import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    console.log(">> CHECKOUT API HIT");

    const body = await req.json();
    console.log(">> Checkout Body:", body);

    const { tableNumber } = body;
    console.log(">> tableNumber:", tableNumber);

    if (!tableNumber) {
      console.log(">> ERROR: Missing tableNumber");
      return NextResponse.json({ error: "Missing tableNumber" }, { status: 400 });
    }

    const cart = await prisma.cart.findFirst({
      where: { tableNumber: Number(tableNumber) },
      include: {
        cartItems: { include: { menuItem: true } },
      },
    });

    console.log(">> Cart Found:", cart);

    if (!cart) {
      console.log(">> ERROR: No cart");
      return NextResponse.json({ error: "No cart found" }, { status: 400 });
    }

    if (cart.cartItems.length === 0) {
      console.log(">> ERROR: Cart empty");
      return NextResponse.json({ error: "Cart empty" }, { status: 400 });
    }

    const restaurantId = cart.cartItems[0].menuItem.restaurantId;
    console.log(">> restaurantId:", restaurantId);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.cartItems.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.menuItem.name },
          unit_amount: Math.round(item.menuItem.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
      metadata: {
        restaurantId,
        tableNumber: String(tableNumber),
        cartId: cart.id,
      },
    });

    console.log(">> Stripe session created:", session.url);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
