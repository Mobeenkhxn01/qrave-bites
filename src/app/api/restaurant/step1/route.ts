import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import slugify from "slugify";

const restaurantSchema = z.object({
  restaurantname: z.string().min(2).max(50),
  ownername: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10,15}$/),
  mobile: z.boolean().optional().default(false),
  shop: z.number().min(1).max(99999),
  floor: z.string().optional().nullable(),
  area: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  landmark: z.string().optional().nullable(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = restaurantSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
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
    } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Slugify restaurant name
    let baseSlug = slugify(restaurantname, { lower: true, strict: true });
    let slug = baseSlug;
    let suffix = 1;

    // Check if restaurant exists for this user
    const existingRestaurant = await prisma.restaurantStep1.findUnique({
      where: { userId: existingUser.id },
    });

    // If updating and slug is different, ensure uniqueness
    if (existingRestaurant && existingRestaurant.slug !== slug) {
      while (await prisma.restaurantStep1.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix++}`;
      }
    }

    // Upsert restaurant record using userId as the unique identifier
    const restaurantstep1 = await prisma.restaurantStep1.upsert({
      where: { userId: existingUser.id },
      update: {
        restaurantName: restaurantname,
        ownerName: ownername,
        email,
        phone,
        mobile,
        shop,
        floor: floor || null,
        area,
        city,
        landmark: landmark || null,
        latitude: latitude || null,
        longitude: longitude || null,
        address: address || null,
        slug,
        updatedAt: new Date(),
      },
      create: {
        restaurantName: restaurantname,
        ownerName: ownername,
        email,
        phone,
        mobile,
        shop,
        floor: floor || null,
        area,
        city,
        landmark: landmark || null,
        latitude: latitude || null,
        longitude: longitude || null,
        address: address || null,
        slug,
        user: {
          connect: {
            id: existingUser.id,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    const isNew =
      restaurantstep1.createdAt.getTime() ===
      restaurantstep1.updatedAt.getTime();

    return NextResponse.json(
      {
        success: true,
        data: {
          message: isNew
            ? "Restaurant created successfully"
            : "Restaurant updated successfully",
          restaurant: {
            id: restaurantstep1.id,
            slug: restaurantstep1.slug,
            restaurantName: restaurantstep1.restaurantName,
            ownerName: restaurantstep1.ownerName,
            email: restaurantstep1.email,
            phone: restaurantstep1.phone,
            mobile: restaurantstep1.mobile,
            shop: restaurantstep1.shop,
            floor: restaurantstep1.floor,
            area: restaurantstep1.area,
            city: restaurantstep1.city,
            landmark: restaurantstep1.landmark,
            address: restaurantstep1.address,
            latitude: restaurantstep1.latitude,
            longitude: restaurantstep1.longitude,
            createdAt: restaurantstep1.createdAt,
            updatedAt: restaurantstep1.updatedAt,
          },
          user: restaurantstep1.user,
          isNew,
        },
      },
      { status: isNew ? 201 : 200 }
    );
  } catch (error) {
    console.error("POST Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: "A restaurant with this information already exists",
          message: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const restaurantstep1 = await prisma.restaurantStep1.findUnique({
      where: { email },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!restaurantstep1) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        restaurant: {
          id: restaurantstep1.id,
          slug: restaurantstep1.slug,
          restaurantName: restaurantstep1.restaurantName,
          ownerName: restaurantstep1.ownerName,
          email: restaurantstep1.email,
          phone: restaurantstep1.phone,
          mobile: restaurantstep1.mobile,
          shop: restaurantstep1.shop,
          floor: restaurantstep1.floor,
          area: restaurantstep1.area,
          city: restaurantstep1.city,
          landmark: restaurantstep1.landmark,
          address: restaurantstep1.address,
          latitude: restaurantstep1.latitude,
          longitude: restaurantstep1.longitude,
          createdAt: restaurantstep1.createdAt,
          updatedAt: restaurantstep1.updatedAt,
        },
        user: restaurantstep1.user,
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}