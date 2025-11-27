"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ToastClient({
  noCities,
}: {
  noCities: boolean;
}) {
  useEffect(() => {
    if (noCities) {
      toast.error("No cities found!");
    }
  }, [noCities]);

  return null;
}
