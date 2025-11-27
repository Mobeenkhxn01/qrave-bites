import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async (req: Request) => {
  const session = await auth();

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const orderId = url.searchParams.get("_id");
  const role = session.user.role;
  const userId = session.user.id;

  try {
    if (role === "ADMIN") {
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: { include: { menuItem: true } },
            restaurant: true,
          },
        });

        if (!order) {
          return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(order), { status: 200 });
      }

      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { menuItem: true } },
          restaurant: true,
        },
      });

      return new Response(JSON.stringify(orders), { status: 200 });
    }

    const restaurant = await prisma.restaurantStep1.findUnique({
      where: { userId },
    });

    if (!restaurant) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const restaurantId = restaurant.id;

    if (orderId) {
      const order = await prisma.order.findFirst({
        where: { id: orderId, restaurantId },
        include: {
          items: { include: { menuItem: true } },
          restaurant: true,
        },
      });

      if (!order) {
        return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
      }

      return new Response(JSON.stringify(order), { status: 200 });
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
      },
    });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
};
