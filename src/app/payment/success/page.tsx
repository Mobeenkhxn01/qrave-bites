"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import OrderClient from "./OrderClient";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stripe-session", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await axios.get(
        `/api/stripe/session/${sessionId}`
      );
      return res.data as { orderId: string };
    },
  });

  if (!sessionId) {
    return (
      <div className="p-10 text-center text-red-500">
        Invalid payment session
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-10 text-center">Verifying payment...</div>;
  }

  if (isError || !data?.orderId) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to verify payment
      </div>
    );
  }

  return <OrderClient orderId={data.orderId} />;
}
