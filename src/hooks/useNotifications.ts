import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useNotifications(restaurantId?: string) {
  return useQuery({
    queryKey: ["notifications", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/notifications?restaurantId=${restaurantId}`
      );
      return data ?? [];
    },
    initialData: [],
    staleTime: 2 * 60 * 1000, // 2 minutes for notifications
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time feel
    retry: 1,
  });
}
