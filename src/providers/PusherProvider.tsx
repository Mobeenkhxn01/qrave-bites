"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function PusherProvider({
  restaurantId,
  children,
}: {
  restaurantId?: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!restaurantId) return;
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`restaurant-${restaurantId}`);

    channel.bind("new-order", (data: any) => {
      toast.success(
        `New order #${data.orderNumber} • Table ${data.tableNumber}`
      );

      queryClient.invalidateQueries({
        queryKey: ["notifications", restaurantId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", restaurantId],
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [restaurantId, queryClient]);

  return <>{children}</>;
}
