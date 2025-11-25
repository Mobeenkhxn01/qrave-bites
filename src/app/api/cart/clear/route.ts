// app/api/cart/clear/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get("table");

  if (table) {
    const cart = await prisma.cart.findFirst({ where: { tableNumber: Number(table) } });
    if (!cart) return NextResponse.json({ success: true });
    await prisma.cart.delete({ where: { id: cart.id } });
    return NextResponse.json({ success: true });
  }

  // otherwise user must be logged in
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findFirst({ where: { userId: session.user.id } });
  if (!cart) return NextResponse.json({ success: true });
  await prisma.cart.delete({ where: { id: cart.id } });
  return NextResponse.json({ success: true });
}
