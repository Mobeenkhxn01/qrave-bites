// src/hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async () => {
  const response = await fetch("/api/profile");
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });
};
