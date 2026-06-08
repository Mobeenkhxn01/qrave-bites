import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  createdAt: string;
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await axios.get("/api/staff");
      return res.data as Staff[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email?: string;
      role: string;
    }) => {
      const res = await axios.post("/api/staff", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member added");
    },
    onError: () => {
      toast.error("Failed to add staff member");
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name?: string; role?: string }) => {
      const res = await axios.put("/api/staff", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member updated");
    },
    onError: () => {
      toast.error("Failed to update staff member");
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete("/api/staff", { data: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member removed");
    },
    onError: () => {
      toast.error("Failed to remove staff member");
    },
  });
}
