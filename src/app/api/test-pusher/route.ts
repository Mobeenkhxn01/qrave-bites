import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const restaurantId = "resto_123"; // Test restaurant ID
    const fakeOrder = {
      id: "order_" + Date.now(),
      tableNumber: 5,
      totalAmount: 450,
      status: "pending",
      items: [
        { name: "Margherita Pizza", qty: 2, price: 200 },
        { name: "Coke", qty: 1, price: 50 },
      ],
    };

    // Trigger a Pusher event
    await pusherServer.trigger(`restaurant-${restaurantId}`, "new-order", fakeOrder);

    return NextResponse.json({ success: true, message: "Test order sent!", order: fakeOrder });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to send test order" }, { status: 500 });
  }
}
