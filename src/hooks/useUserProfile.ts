// src/hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";

// Create stable fetch function outside hook
const fetchUserProfile = async () => {
  const response = await fetch("/api/profile");
  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403
      if (error?.message?.includes("Unauthorized")) return false;
      return failureCount < 2;
    },
  });
};
