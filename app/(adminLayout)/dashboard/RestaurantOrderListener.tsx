"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

const MAX_ORDERS_DISPLAY = 50; // Prevent memory leak from unlimited array growth

export default function RestaurantOrderListener({ restaurantId }: { restaurantId: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const pusher = pusherClient;
    const channel = pusher.subscribe(`restaurant-${restaurantId}`);

    const handleNewOrder = (data: any) => {
      console.log("New order:", data);
      setOrders((prev) => {
        const updated = [data, ...prev];
        // Keep only last 50 orders to prevent memory bloat
        return updated.slice(0, MAX_ORDERS_DISPLAY);
      });
    };

    channel.bind("new-order", handleNewOrder);

    return () => {
      channel.unbind("new-order", handleNewOrder);
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [restaurantId]);

  return (
    <div>
      <h2>New Orders</h2>
      <ul>
        {orders.map((o, i) => (
          <li key={i}>
            Order #{o.orderId} → ₹{o.totalAmount} (Table {o.tableId})
          </li>
        ))}
      </ul>
    </div>
  );
}
