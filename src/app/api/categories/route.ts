import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, userID } = await req.json();

    // Check if category already exists for the same user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.toLowerCase(),
        userID,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create new category if it doesn't exist
    const category = await prisma.category.create({
      data: {
        name: name.toLowerCase(),
        userID,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();

    // Ensure category exists before updating
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: name.toLowerCase() },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || undefined;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
