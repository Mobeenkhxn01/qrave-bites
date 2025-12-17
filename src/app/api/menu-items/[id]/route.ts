import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { menuItemIdQuerySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const parsedQuery = menuItemIdQuerySchema.safeParse({
    id: url.searchParams.get("id"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const { id } = parsedQuery.data;

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!menuItem) {
    return NextResponse.json(
      { error: "MenuItem not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ menuItem }, { status: 200 });
}
