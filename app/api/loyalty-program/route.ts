import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, pointsPerRupee, redeemValue } = await req.json();

    if (!name || !pointsPerRupee || !redeemValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurantStep1.findFirst({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const program = await prisma.loyaltyProgram.create({
      data: {
        name,
        pointsPerRupee,
        redeemValue,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error("LOYALTY_PROGRAM_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const action = searchParams.get("action");

    if (!restaurantId) {
      return NextResponse.json([], { status: 200 });
    }

    if (action === "member") {
      const phoneNumber = searchParams.get("phoneNumber");
      if (!phoneNumber) {
        return NextResponse.json({}, { status: 200 });
      }

      const member = await prisma.loyaltyMember.findFirst({
        where: {
          program: { restaurantId },
          phoneNumber,
        },
        include: { program: true },
      });

      return NextResponse.json(member || {});
    }

    const programs = await prisma.loyaltyProgram.findMany({
      where: { restaurantId },
      include: { members: { take: 5 } },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error("GET_LOYALTY_PROGRAMS_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { action, phoneNumber, restaurantId, points } = await req.json();

    if (action === "addPoints") {
      const program = await prisma.loyaltyProgram.findFirst({
        where: { restaurantId },
      });

      if (!program) {
        return NextResponse.json(
          { error: "Program not found" },
          { status: 404 }
        );
      }

      let member = await prisma.loyaltyMember.findFirst({
        where: {
          programId: program.id,
          phoneNumber,
        },
      });

      if (!member) {
        member = await prisma.loyaltyMember.create({
          data: {
            phoneNumber,
            totalPoints: points,
            programId: program.id,
          },
        });
      } else {
        member = await prisma.loyaltyMember.update({
          where: { id: member.id },
          data: {
            totalPoints: { increment: points },
          },
        });
      }

      return NextResponse.json(member);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("LOYALTY_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
