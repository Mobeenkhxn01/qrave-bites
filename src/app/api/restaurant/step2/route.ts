import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Load restaurant step2 data by user email
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
  }

  // Fetch RestaurantStep1 by user email
  const step1 = await prisma.restaurantStep1.findUnique({
    where: { email },
    include: { step2: true }, // Updated relation field
  });

  if (!step1 || !step1.step2) {
    return NextResponse.json({ success: false, message: "No data found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: step1.step2,
  });
}

// POST: Create or update RestaurantStep2
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

    // Fetch RestaurantStep1 for this user
    const step1 = await prisma.restaurantStep1.findUnique({ where: { email } });

    if (!step1) {
      return NextResponse.json({ success: false, message: "RestaurantStep1 not found" }, { status: 404 });
    }

    // Check if step2 already exists for this step1
    const existing = await prisma.restaurantStep2.findUnique({ where: { step1Id: step1.id } });

    let result;
    if (existing) {
      // Update existing step2
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
      // Create new step2
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
          step1Id: step1.id, // Link to RestaurantStep1
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Restaurant step2 details saved successfully",
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
