"use client";

import { useEffect, useCallback } from "react";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface NewOrderEvent {
  orderNumber: string;
  tableNumber: number;
  orderId: string;
}

export default function PusherProvider({
  restaurantId,
  children,
}: {
  restaurantId?: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const handleNewOrder = useCallback((data: NewOrderEvent) => {
    if (!data?.orderNumber || !data?.tableNumber) {
      console.warn("Invalid order data received:", data);
      return;
    }
    
    toast.success(
      `New order #${data.orderNumber} • Table ${data.tableNumber}`
    );

    // Only invalidate specific queries instead of all
    queryClient.invalidateQueries({
      queryKey: ["orders", restaurantId],
      exact: true,
    });
  }, [restaurantId, queryClient]);

  useEffect(() => {
    if (!restaurantId) return;
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) return;

    let pusher: Pusher;
    try {
      pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });

      const channel = pusher.subscribe(`restaurant-${restaurantId}`);
      
      channel.bind("new-order", handleNewOrder);

      // Cleanup on unmount or restaurantId change
      return () => {
        channel.unbind("new-order", handleNewOrder);
        channel.unsubscribe();
        pusher.disconnect();
      };
    } catch (error) {
      console.error("Pusher initialization error:", error);
      return;
    }
  }, [restaurantId, handleNewOrder]);

  return <>{children}</>;
}
