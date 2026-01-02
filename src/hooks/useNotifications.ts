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
  });
}
