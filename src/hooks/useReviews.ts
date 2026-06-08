import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  photos: string[];
  createdAt: string;
  user: { name?: string; image?: string };
}

export function useMenuItemReviews(menuItemId: string) {
  return useQuery({
    queryKey: ["reviews", menuItemId],
    queryFn: async () => {
      const res = await axios.get(`/api/reviews?menuItemId=${menuItemId}`);
      return res.data as Review[];
    },
    enabled: !!menuItemId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      menuItemId: string;
      rating: number;
      comment?: string;
      photos?: string[];
    }) => {
      const res = await axios.post("/api/reviews", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", data.menuItemId],
      });
      toast.success("Review posted");
    },
    onError: () => {
      toast.error("Failed to post review");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete("/api/reviews", { data: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted");
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });
}
