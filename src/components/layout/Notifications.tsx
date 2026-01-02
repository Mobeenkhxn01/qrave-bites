"use client";

import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher-client";

export default function Notifications() {
  useEffect(() => {
    const channel = pusherClient.subscribe("orders");

    channel.bind("new-order", (data: any) => {
      console.log("Order received", data);
    });

    return () => {
      pusherClient.unsubscribe("orders");
    };
  }, []);

  return null; // no UI, just listener
}
