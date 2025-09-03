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

  const email = session.user.email;
  const role = session.user.role;
  const url = new URL(req.url);
  const orderId = url.searchParams.get("_id");

  try {
    if (role === "ADMIN" ) {
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (!order) {
          return new Response(JSON.stringify({ error: "Order not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(order), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const orders = await prisma.order.findMany();
      return new Response(JSON.stringify(orders), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (email) {
      const userOrders = await prisma.order.findMany({
        where: { userId: email },
      });

      return new Response(JSON.stringify(userOrders), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong", details: error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
