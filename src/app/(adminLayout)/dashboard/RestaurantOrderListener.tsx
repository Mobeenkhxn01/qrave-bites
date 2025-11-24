"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

export default function RestaurantOrderListener({ restaurantId }: { restaurantId: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const pusher = pusherClient;
    const channel = pusher.subscribe(`restaurant-${restaurantId}`);

    channel.bind("new-order", (data: any) => {
      console.log("New order:", data);
      setOrders((prev) => [data, ...prev]);
    });

    return () => {
      channel.unbind_all();
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
