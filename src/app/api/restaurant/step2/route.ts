import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  const step1 = await prisma.restaurantStep1.findUnique({
    where: { email },
    include: { step2: true },
  });

  if (!step1?.step2) {
    return NextResponse.json(
      { success: false, message: "No data found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: step1.step2 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      cuisine,
      restaurantImageUrl,
      foodImageUrl,
      deliveryImageUrl,
      restaurantProfileUrl,
      days,
      openingTime,
      closingTime,
      email,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    const step1 = await prisma.restaurantStep1.findUnique({
      where: { email },
    });

    if (!step1) {
      return NextResponse.json(
        { success: false, message: "RestaurantStep1 not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.restaurantStep2.findUnique({
      where: { step1Id: step1.id },
    });

    const result = existing
      ? await prisma.restaurantStep2.update({
          where: { id: existing.id },
          data: {
            cuisine,
            restaurantImageUrl,
            foodImageUrl,
            deliveryImageUrl,
            restaurantProfileUrl,
            days,
            openingTime,
            closingTime,
          },
        })
      : await prisma.restaurantStep2.create({
          data: {
            cuisine,
            restaurantImageUrl,
            foodImageUrl,
            deliveryImageUrl,
            restaurantProfileUrl,
            days,
            openingTime,
            closingTime,
            step1Id: step1.id,
          },
        });

    return NextResponse.json({
      success: true,
      message: "Restaurant step2 details saved successfully",
      data: result,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong while saving data" },
      { status: 500 }
    );
  }
}
