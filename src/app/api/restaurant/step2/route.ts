import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Load restaurant step2 data by user email
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
  }

  const step1 = await prisma.restaurantStep1.findUnique({
    where: { email },
    include: { RestaurantStep2: true },
  });

  if (!step1 || !step1.RestaurantStep2) {
    return NextResponse.json({ success: false, message: "No data found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      restaurant: step1.RestaurantStep2,
    },
  });
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
      return NextResponse.json({ success: false, message: "User email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const existing = await prisma.restaurantStep2.findFirst({ where: { userId: user.id } });

    let result;

    if (existing) {
      result = await prisma.restaurantStep2.update({
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
      });
    } else {
      result = await prisma.restaurantStep2.create({
        data: {
          cuisine,
          restaurantImageUrl,
          foodImageUrl,
          deliveryImageUrl,
          restaurantProfileUrl,
          days,
          openingTime,
          closingTime,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Restaurant details saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("POST /api/restaurant/step2 error", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while saving data" },
      { status: 500 }
    );
  }
}
