import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { AccountType } from "@prisma/client";

// Validation schema
const step3Schema = z.object({
  panNumber: z.string().min(10, "PAN number must be 10 characters").max(10),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  restaurantAddress: z.string().min(5, "Address must be at least 5 characters").max(500),
  panImage: z.string().url("Invalid PAN image URL").optional().nullable(),
  accountNumber: z.string().min(9, "Account number must be at least 9 digits").max(18),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  accountType: z.nativeEnum(AccountType),
  upiId: z.string().optional().nullable(),
  email: z.string().email("Invalid email format"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Fetch user along with Step3 data
    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        restaurantStep3: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.restaurantStep3 || user.restaurantStep3.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Step 3 data found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user.restaurantStep3[0],
    });
  } catch (error) {
    console.error("GET /api/restaurant/step3 error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch Step 3 data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming Step 3 Payload:", body);

    // Validate request body
    const validationResult = step3Schema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      panNumber,
      fullName,
      restaurantAddress,
      panImage,
      accountNumber,
      ifscCode,
      accountType,
      upiId,
      email,
    } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check for existing Step3 data
    const existing = await prisma.restaurantStep3.findFirst({
      where: { userId: user.id },
    });

    let result;
    const isNew = !existing;

    if (existing) {
      // Update existing record
      result = await prisma.restaurantStep3.update({
        where: { id: existing.id },
        data: {
          panNumber,
          fullName,
          restaurantAddress,
          panImage: panImage || null,
          accountNumber,
          ifscCode,
          accountType,
          upiId: upiId || null,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new record
      result = await prisma.restaurantStep3.create({
        data: {
          panNumber,
          fullName,
          restaurantAddress,
          panImage: panImage || null,
          accountNumber,
          ifscCode,
          accountType,
          upiId: upiId || null,
          userId: user.id,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: isNew
          ? "Restaurant Step 3 details created successfully"
          : "Restaurant Step 3 details updated successfully",
        data: result,
        isNew,
      },
      { status: isNew ? 201 : 200 }
    );
  } catch (error: any) {
    console.error("POST /api/restaurant/step3 error:", error);

    // Handle unique constraint violations
    if (error.code === "P2002") {
      const target = error.meta?.target;
      let field = "field";
      
      if (Array.isArray(target)) {
        field = target[0];
      }

      return NextResponse.json(
        {
          success: false,
          message: `This ${field} is already registered`,
          error: `Duplicate ${field}`,
        },
        { status: 409 }
      );
    }

    // Handle other Prisma errors
    if (error.code) {
      return NextResponse.json(
        {
          success: false,
          message: "Database error occurred",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving Step 3 data",
      },
      { status: 500 }
    );
  }
}