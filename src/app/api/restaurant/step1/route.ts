import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// Validation schema
const restaurantSchema = z.object({
  restaurantname: z.string().min(2, "Restaurant name must be at least 2 characters").max(50, "Restaurant name must be less than 50 characters"),
  ownername: z.string().min(2, "Owner name must be at least 2 characters").max(50, "Owner name must be less than 50 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10,15}$/, "Phone number must be 10-15 digits"),
  mobile: z.boolean().optional().default(false),
  shop: z.number().min(1, "Shop number must be at least 1").max(99999, "Shop number too large"),
  floor: z.string().optional().nullable(),
  area: z.string().min(2, "Area must be at least 2 characters").max(50, "Area must be less than 50 characters"),
  city: z.string().min(2, "City must be at least 2 characters").max(50, "City must be less than 50 characters"),
  landmark: z.string().optional().nullable(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input data
    const validationResult = restaurantSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
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

    // 🔍 Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found. Please register first." },
        { status: 404 }
      );
    }

    // 🔄 Use upsert for create or update
    const restaurant = await prisma.restaurant.upsert({
      where: {
        email: email,
      },
      update: {
        restaurantName: restaurantname,
        ownerName: ownername,
        phone: phone,
        mobile: mobile,
        shop: shop,
        floor: floor || null,
        area: area,
        city: city,
        landmark: landmark || null,
        latitude: latitude || null,
        longitude: longitude || null,
        address: address || null,
        updatedAt: new Date(),
      },
      create: {
        restaurantName: restaurantname,
        ownerName: ownername,
        email: email,
        phone: phone,
        mobile: mobile,
        shop: shop,
        floor: floor || null,
        area: area,
        city: city,
        landmark: landmark || null,
        latitude: latitude || null,
        longitude: longitude || null,
        address: address || null,
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
          }
        }
      }
    });

    // Determine if it was created or updated
    const isNewRestaurant = restaurant.createdAt.getTime() === restaurant.updatedAt.getTime();

    return NextResponse.json(
      {
        success: true,
        message: isNewRestaurant 
          ? "Restaurant created successfully" 
          : "Restaurant updated successfully",
        data: {
          restaurant: {
            id: restaurant.id,
            restaurantName: restaurant.restaurantName,
            ownerName: restaurant.ownerName,
            email: restaurant.email,
            phone: restaurant.phone,
            mobile: restaurant.mobile,
            location: {
              shop: restaurant.shop,
              floor: restaurant.floor,
              area: restaurant.area,
              city: restaurant.city,
              landmark: restaurant.landmark,
              address: restaurant.address,
              coordinates: {
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }
            },
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
          },
          user: restaurant.user,
          isNew: isNewRestaurant,
        }
      },
      { status: isNewRestaurant ? 201 : 200 }
    );

  } catch (error) {
    console.error("Error in restaurant registration:", error);
 
      return NextResponse.json(
        { 
          error: "Duplicate entry", 
          message: "A restaurant with this information already exists" 
        },
        { status: 409 }
      );
   
      return NextResponse.json(
        { 
          error: "Foreign key constraint", 
          message: "Referenced user does not exist" 
        },
        { status: 400 }
      );

      return NextResponse.json(
        { 
          error: "Record not found", 
          message: "User not found for restaurant creation" 
        },
        { status: 404 }
      );
   

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: "Something went wrong while processing your request"
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve restaurant data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { email },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        restaurant: {
          id: restaurant.id,
          restaurantName: restaurant.restaurantName,
          ownerName: restaurant.ownerName,
          email: restaurant.email,
          phone: restaurant.phone,
          mobile: restaurant.mobile,
          location: {
            shop: restaurant.shop,
            floor: restaurant.floor,
            area: restaurant.area,
            city: restaurant.city,
            landmark: restaurant.landmark,
            address: restaurant.address,
            coordinates: {
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }
          },
          createdAt: restaurant.createdAt,
          updatedAt: restaurant.updatedAt,
        },
        user: restaurant.user,
      }
    });

  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}