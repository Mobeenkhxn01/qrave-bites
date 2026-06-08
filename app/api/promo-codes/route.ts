import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      validFrom,
      validUntil,
      minOrderAmount,
    } = await req.json();

    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        maxUses,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        minOrderAmount,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    console.error("PROMO_CODE_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const restaurantId = searchParams.get("restaurantId");

    if (code && restaurantId) {
      const promoCode = await prisma.promoCode.findFirst({
        where: {
          code: code.toUpperCase(),
          restaurantId,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      });

      if (!promoCode) {
        return NextResponse.json(
          { error: "Promo code not found or expired" },
          { status: 404 }
        );
      }

      if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return NextResponse.json(
          { error: "Promo code usage limit reached" },
          { status: 400 }
        );
      }

      return NextResponse.json(promoCode);
    }

    if (restaurantId) {
      const codes = await prisma.promoCode.findMany({
        where: { restaurantId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(codes);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("GET_PROMO_CODES_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updateData } = await req.json();

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(promoCode);
  } catch (error) {
    console.error("PROMO_CODE_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    await prisma.promoCode.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PROMO_CODE_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
