"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ToastClient({
  noRestaurants,
}: {
  noRestaurants: boolean;
}) {
  useEffect(() => {
    if (noRestaurants) {
      toast.error("No restaurants found in this city!");
    }
  }, [noRestaurants]);

  return null;
}
