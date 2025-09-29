"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

interface Order {
  id: string;
  tableNumber: number;
  totalAmount: number;
  status: string;
  items: { name: string; qty: number; price: number }[];
}

export default function Dashboard() {
  const restaurantId = "resto_123"; // hardcoded for testing
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`restaurant-${restaurantId}`);

    channel.bind("new-order", (data: Order) => {
      setOrders((prev) => [data, ...prev]);
      alert(`New order received from table ${data.tableNumber}`);
      console.log("New order received:", data);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [restaurantId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Live Orders</h1>
      <ul className="mt-4 space-y-3">
        {orders.map((order) => (
          <li key={order.id} className="p-3 border rounded-lg shadow-sm bg-white">
            <p>Table: {order.tableNumber}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>Status: {order.status}</p>
            <ul className="ml-4 mt-2 list-disc">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.qty} × {item.name} — ₹{item.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
