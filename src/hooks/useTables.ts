import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export interface Table {
  id: string;
  number: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";
  capacity: number;
  scan: number;
  lastOccupied?: string;
  createdAt: string;
  orders?: Array<any>;
}

export function useTables(
  restaurantId: string,
  action?: "dashboard" | "all"
) {
  return useQuery({
    queryKey: ["tables", restaurantId, action],
    queryFn: async () => {
      const params = new URLSearchParams({ restaurantId });
      if (action) {
        params.append("action", action);
      }
      const res = await axios.get(`/api/tables?${params}`);
      return res.data as Table[];
    },
    enabled: !!restaurantId,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      action?: "markOccupied" | "markAvailable" | "markCleaning";
      status?: string;
    }) => {
      const res = await axios.put("/api/tables", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Table updated");
    },
    onError: () => {
      toast.error("Failed to update table");
    },
  });
}
