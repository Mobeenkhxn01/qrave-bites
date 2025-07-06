import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agreement, email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const existing = await prisma.restaurantStep4.findFirst({ where: { userId: user.id } });

    let result;
    if (existing) {
      result = await prisma.restaurantStep4.update({
        where: { id: existing.id },
        data: { agreement },
      });
    } else {
      result = await prisma.restaurantStep4.create({
        data: {
          userId: user.id,
          agreement,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Step 4 agreement saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Step 4 Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while saving agreement" },
      { status: 500 }
    );
  }
}
