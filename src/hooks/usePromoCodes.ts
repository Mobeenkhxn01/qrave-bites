import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  minOrderAmount?: number;
}

export function usePromoCodes(restaurantId: string) {
  return useQuery({
    queryKey: ["promo-codes", restaurantId],
    queryFn: async () => {
      const res = await axios.get(`/api/promo-codes?restaurantId=${restaurantId}`);
      return res.data as PromoCode[];
    },
    enabled: !!restaurantId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useValidatePromoCode(
  restaurantId: string,
  code: string
) {
  return useQuery({
    queryKey: ["promo-codes", restaurantId, "validate", code],
    queryFn: async () => {
      const res = await axios.get(
        `/api/promo-codes?restaurantId=${restaurantId}&code=${code}`
      );
      return res.data as PromoCode;
    },
    enabled: !!restaurantId && !!code,
    staleTime: 1 * 60 * 1000,
  });
}

export function useCreatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      code: string;
      description?: string;
      discountType: "fixed" | "percentage";
      discountValue: number;
      maxUses?: number;
      validFrom: string;
      validUntil: string;
      minOrderAmount?: number;
    }) => {
      const res = await axios.post("/api/promo-codes", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast.success("Promo code created");
    },
    onError: () => {
      toast.error("Failed to create promo code");
    },
  });
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; isActive?: boolean }) => {
      const res = await axios.put("/api/promo-codes", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast.success("Promo code updated");
    },
    onError: () => {
      toast.error("Failed to update promo code");
    },
  });
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete("/api/promo-codes", { data: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast.success("Promo code deleted");
    },
    onError: () => {
      toast.error("Failed to delete promo code");
    },
  });
}
