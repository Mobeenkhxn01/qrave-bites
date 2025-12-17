import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categoryIdQuerySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const parsedQuery = categoryIdQuerySchema.safeParse({
    id: url.searchParams.get("id"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const { id } = parsedQuery.data;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(category, { status: 200 });
}
