import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import slugify from "slugify";
import {
  restaurantStep1Schema,
  restaurantByEmailSchema,
} from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = restaurantStep1Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      restaurantname,
      ownername,
      email,
      phone,
      mobile,
      shop,
      floor,
      area,
      city,
      landmark,
      latitude,
      longitude,
      address,
    } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const baseSlug = slugify(restaurantname, { lower: true, strict: true });
    let slug = baseSlug;
    let i = 1;

    while (await prisma.restaurantStep1.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    const existing = await prisma.restaurantStep1.findUnique({
      where: { userId: user.id },
    });

    const result = existing
      ? await prisma.restaurantStep1.update({
          where: { userId: user.id },
          data: {
            restaurantName: restaurantname,
            ownerName: ownername,
            email,
            phone,
            mobile,
            shop,
            floor: floor ?? null,
            area,
            city,
            landmark: landmark ?? null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            address: address ?? null,
            slug,
            updatedAt: new Date(),
          },
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        })
      : await prisma.restaurantStep1.create({
          data: {
            restaurantName: restaurantname,
            ownerName: ownername,
            email,
            phone,
            mobile,
            shop,
            floor: floor ?? null,
            area,
            city,
            landmark: landmark ?? null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            address: address ?? null,
            slug,
            user: { connect: { id: user.id } },
          },
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        });

    return NextResponse.json({
      success: true,
      message: existing
        ? "Restaurant updated successfully"
        : "Restaurant created successfully",
      data: result,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const parsedQuery = restaurantByEmailSchema.safeParse({
      email: new URL(req.url).searchParams.get("email"),
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { success: false, message: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { email } = parsedQuery.data;

    const restaurant = await prisma.restaurantStep1.findUnique({
      where: { email },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: restaurant,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
