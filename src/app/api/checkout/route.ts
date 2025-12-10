import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { tableNumber } = await req.json();

    if (!tableNumber) {
      return NextResponse.json({ error: "Missing tableNumber" }, { status: 400 });
    }

    const cart = await prisma.cart.findFirst({
      where: { tableNumber: Number(tableNumber) },
      include: { cartItems: { include: { menuItem: true } } },
    });

    if (!cart) {
      return NextResponse.json({ error: "No cart found for this table" }, { status: 400 });
    }

    if (!cart.cartItems.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }


    const restaurantId = cart.cartItems[0]?.menuItem?.restaurantId;

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Restaurant ID missing in menu item" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.cartItems.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.menuItem.name,
            images: item.menuItem.image ? [item.menuItem.image] : [],
          },
          unit_amount: Math.round(item.menuItem.price * 100),
        },
        quantity: item.quantity,
      })),

      success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?table=${tableNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel?table=${tableNumber}`,

      metadata: {
        restaurantId: String(restaurantId),
        tableNumber: String(tableNumber),
        cartId: String(cart.id),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout error" },
      { status: 500 }
    );
  }
}
