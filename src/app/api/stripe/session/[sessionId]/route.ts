import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.MOBEEN_STRIPE_SECRET_KEY!);

type Params = {
  sessionId: string;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    // ✅ IMPORTANT: await params
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID missing" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order not found for this session" },
        { status: 404 }
      );
    }

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("SESSION_LOOKUP_ERROR", error);
    return NextResponse.json(
      { error: "Failed to retrieve Stripe session" },
      { status: 500 }
    );
  }
}
