import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { menuItemId, rating, comment, photos } = await req.json();

    if (!menuItemId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid menuItemId and rating (1-5) required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        menuItemId,
        userId: session.user.id,
        rating,
        comment: comment || null,
        photos: photos || [],
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("REVIEW_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = searchParams.get("menuItemId");

    if (!menuItemId) {
      return NextResponse.json([], { status: 200 });
    }

    const reviews = await prisma.review.findMany({
      where: { menuItemId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET_REVIEWS_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review || review.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REVIEW_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
