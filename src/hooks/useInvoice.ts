import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  isPaid: boolean;
  paidAt?: string;
}

export function useInvoice(orderId: string) {
  return useQuery({
    queryKey: ["invoice", orderId],
    queryFn: async () => {
      const res = await axios.get(`/api/invoices?orderId=${orderId}`);
      return res.data;
    },
    enabled: !!orderId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await axios.post("/api/invoices", { orderId });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", data.orderId] });
      toast.success("Invoice generated");
    },
    onError: () => {
      toast.error("Failed to generate invoice");
    },
  });
}

export function useRestaurantInvoices(restaurantId: string) {
  return useQuery({
    queryKey: ["invoices", restaurantId],
    queryFn: async () => {
      const res = await axios.get(`/api/invoices?restaurantId=${restaurantId}`);
      return res.data;
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
}
