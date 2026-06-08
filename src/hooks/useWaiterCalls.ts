import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export interface WaiterCall {
  id: string;
  tableId: string;
  reason?: string;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  table?: { number: number };
}

export function useWaiterCalls(restaurantId: string, resolved?: boolean) {
  return useQuery({
    queryKey: ["waiter-calls", restaurantId, resolved],
    queryFn: async () => {
      const params = new URLSearchParams({ restaurantId });
      if (resolved !== undefined) {
        params.append("resolved", resolved.toString());
      }
      const res = await axios.get(`/api/waiter-calls?${params}`);
      return res.data;
    },
    enabled: !!restaurantId,
    staleTime: 5 * 1000, // refresh quickly for real-time
    refetchInterval: 3 * 1000,
  });
}

export function useCallWaiter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tableId: string;
      restaurantId: string;
      reason?: string;
    }) => {
      const res = await axios.post("/api/waiter-calls", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["waiter-calls"] });
      toast.success("Waiter called");
    },
    onError: () => {
      toast.error("Failed to call waiter");
    },
  });
}

export function useResolveWaiterCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.put("/api/waiter-calls", {
        id,
        resolved: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiter-calls"] });
      toast.success("Call resolved");
    },
    onError: () => {
      toast.error("Failed to resolve call");
    },
  });
}
