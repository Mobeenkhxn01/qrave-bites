import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/profile
 * Update the user's basic info and address.
 */
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, name, image, ...otherUserInfo } = data;

    // Determine which user to update
    let filter;
    if (id) {
      filter = { id };
    } else {
      const session = await auth();
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      filter = { email: session.user.email };
    }

    // Find user
    const user = await prisma.user.findUnique({ where: filter });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update basic user info
    await prisma.user.update({
      where: { id: user.id },
      data: { name, image },
    });

    // Update or create address info
    await prisma.userAddress.upsert({
  where: {
    email_userId: {
      email: user.email,
      userId: user.id,
    },
  },
  update: { ...otherUserInfo },
  create: {
    email: user.email,
    userId: user.id,
    ...otherUserInfo,
  },
});


    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * GET /api/profile
 * Fetch the currently logged-in user's full profile
 * including user and address data.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userAddresses: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
