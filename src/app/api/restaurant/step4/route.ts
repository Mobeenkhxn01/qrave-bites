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

    // Save Step 4 agreement
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
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });

    return NextResponse.json({
      success: true,
      message: "Step 4 agreement saved and role updated to ADMIN",
      data: {
        ...result,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Step 4 Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while saving agreement" },
      { status: 500 }
    );
  }
}
