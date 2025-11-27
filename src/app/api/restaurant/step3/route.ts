import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const email = new URL(req.url).searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        restaurantStep3: true,
      },
    });

    if (!user?.restaurantStep3?.length) {
      return NextResponse.json(
        { success: false, message: "No Step 3 data found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user.restaurantStep3[0],
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch Step 3 data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      panNumber,
      fullName,
      restaurantAddress,
      panImage,
      accountNumber,
      ifscCode,
      accountType,
      upiId,
      email,
    } = data;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.restaurantStep3.findFirst({
      where: { userId: user.id },
    });

    const result = existing
      ? await prisma.restaurantStep3.update({
          where: { id: existing.id },
          data: {
            panNumber,
            fullName,
            restaurantAddress,
            panImage: panImage || null,
            accountNumber,
            ifscCode,
            accountType,
            upiId: upiId || null,
            updatedAt: new Date(),
          },
        })
      : await prisma.restaurantStep3.create({
          data: {
            panNumber,
            fullName,
            restaurantAddress,
            panImage: panImage || null,
            accountNumber,
            ifscCode,
            accountType,
            upiId: upiId || null,
            userId: user.id,
          },
        });

    return NextResponse.json({
      success: true,
      message: existing
        ? "Restaurant Step 3 details updated"
        : "Restaurant Step 3 details created",
      data: result,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
