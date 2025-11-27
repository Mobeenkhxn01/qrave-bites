import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, name, image, ...otherUserInfo } = data;

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

    const user = await prisma.user.findUnique({ where: filter });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name, image },
    });

    await prisma.userAddress.upsert({
      where: {
        email_userId: {
          email: user.email,
          userId: user.id,
        },
      },
      update: otherUserInfo,
      create: {
        email: user.email,
        userId: user.id,
        ...otherUserInfo,
      },
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userAddresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
