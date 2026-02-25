import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useRestaurantStep2(email: string) {
  return useQuery({
    queryKey: ["restaurant-step2", email],
    queryFn: async () => {
      const { data } = await api.get(
        `/restaurant/step2?email=${email}`
      );
      return data.data;
    },
    enabled: !!email,
  });
}

export function useSaveRestaurantStep2() {
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const { data } = await api.post(
        "/restaurant/step2",
        payload
      );
      return data;
    },
  });
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload", formData);
  return data.url;
}