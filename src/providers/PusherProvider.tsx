"use client";

import React, { useEffect } from "react";
import Pusher from "pusher-js";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function PusherProvider({ restaurantId, children }: { restaurantId?: string; children: React.ReactNode; }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!restaurantId) return;

    const pusher = new Pusher(process.env.MOBEEN_PUSHER_KEY!, { cluster: process.env.MOBEEN_PUSHER_CLUSTER || "ap2" });
    const channel = pusher.subscribe(`restaurant-${restaurantId}`);

    channel.bind("new-order", (data: any) => {
      toast.success(`New order #${data.orderNumber} • Table ${data.tableNumber}`);
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-notifications", restaurantId] });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [restaurantId, queryClient]);

  return (
    <>
      {children}
    </>
  );
}
