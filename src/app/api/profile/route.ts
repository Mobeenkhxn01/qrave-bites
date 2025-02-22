
import { NextResponse } from "next/server";
import { auth} from "@/lib/auth";
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

    // Update User
    await prisma.user.update({
      where: { id: user.id },
      data: { name, image },
    });

    // Update UserInfo (or create if not exists)
    await prisma.userAddress.upsert({
      where: { email: user.email },
      update: { ...otherUserInfo },
      create: { email: user.email, ...otherUserInfo },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try{
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    
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
