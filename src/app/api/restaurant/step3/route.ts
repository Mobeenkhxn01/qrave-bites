import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { restaurantstep3: true },
  });

  if (!user || !user.restaurantstep3) {
    return NextResponse.json({ success: false, message: "No Step 3 data found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      restaurant: user.restaurantstep3,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming Step 3 Payload:", body);
    const {
      panNumber,
      fullName,
      restaurantAddress,
      panImage,
      accountNumber,
      confirmAccountNumber,
      ifscCode,
      accountType,
      upiId,
      email,
    } = body;
    if (accountNumber !== confirmAccountNumber) {
  return NextResponse.json({
    success: false,
    message: "Account numbers do not match",
  }, { status: 400 });
}


    if (!email) {
      return NextResponse.json({ success: false, message: "User email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const existing = await prisma.restaurantStep3.findFirst({ where: { userId: user.id } });

    let result;

    if (existing) {
      result = await prisma.restaurantStep3.update({
        where: { id: existing.id },
        data: {
          panNumber,
          fullName,
          restaurantAddress,
          panImage,
          accountNumber,
          confirmAccountNumber,
          ifscCode,
          accountType,
          upiId,
        },
      });
    } else {
      result = await prisma.restaurantStep3.create({
        data: {
          panNumber,
          fullName,
          restaurantAddress,
          panImage,
          accountNumber,
          confirmAccountNumber,
          ifscCode,
          accountType,
          upiId,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Restaurant Step 3 details saved successfully",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Something went wrong while saving Step 3 data" },
      { status: 500 }
    );
  }
}
