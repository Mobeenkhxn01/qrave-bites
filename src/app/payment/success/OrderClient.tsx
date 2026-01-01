"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
  };
};

type Order = {
  id: string;
  orderNumber: number;
  tableNumber: number | null;
  totalAmount: number;
  status: string;
  paid: boolean;
  createdAt: string;
  items: OrderItem[];
};

export default function OrderClient({ orderId }: { orderId: string }) {
  const { data, isLoading, isError } = useQuery<Order>({
    queryKey: ["guest-order", orderId],
    queryFn: async () => {
      const res = await axios.get(`/api/orders/${orderId}`);
      return res.data;
    },
    refetchInterval: 4000,
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading order...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load order
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Order #{data.orderNumber}
      </h1>

      <div className="border rounded-lg p-4 space-y-2">
        <p>
          <strong>Table:</strong> {data.tableNumber ?? "—"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={data.paid ? "text-green-600" : "text-orange-600"}>
            {data.paid ? "Paid" : "Payment Pending"}
          </span>
        </p>
        <p>
          <strong>Total:</strong> ₹{data.totalAmount}
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Items</h2>

        <ul className="space-y-2">
          {data.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity} × {item.menuItem.name}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {data.paid ? (
        <div className="text-center text-green-600 font-semibold">
          ✅ Payment Successful
        </div>
      ) : (
        <div className="text-center text-orange-600 font-semibold">
          ⏳ Waiting for payment confirmation
        </div>
      )}
    </div>
  );
}
