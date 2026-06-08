import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  numberOfGuests: number;
  reservationTime: string;
  notes?: string;
  status: string;
  tableId?: string;
  table?: { number: number };
  createdAt: string;
}

export function useReservations(
  restaurantId: string,
  status?: string
) {
  return useQuery({
    queryKey: ["reservations", restaurantId, status],
    queryFn: async () => {
      const params = new URLSearchParams({ restaurantId });
      if (status) {
        params.append("status", status);
      }
      const res = await axios.get(`/api/reservations?${params}`);
      return res.data as Reservation[];
    },
    enabled: !!restaurantId,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      restaurantId: string;
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      numberOfGuests: number;
      reservationTime: string;
      notes?: string;
      tableId?: string;
    }) => {
      const res = await axios.post("/api/reservations", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reservations", data.restaurantId],
      });
      toast.success("Reservation created");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create reservation");
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status?: string }) => {
      const res = await axios.put("/api/reservations", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reservation updated");
    },
    onError: () => {
      toast.error("Failed to update reservation");
    },
  });
}
