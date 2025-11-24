import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  const { items, restaurantId, tableId } = body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,

    metadata: {
      restaurantId,
      tableId,
      items: JSON.stringify(items),
    },
  });

  return NextResponse.json({ url: session.url });
}
