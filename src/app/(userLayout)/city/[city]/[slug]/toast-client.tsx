"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ToastClient({
  restaurantMissing,
  menuMissing,
  tableInvalid,
}: {
  restaurantMissing: boolean;
  menuMissing: boolean;
  tableInvalid: boolean;
}) {
  useEffect(() => {
    if (restaurantMissing) toast.error("Restaurant not found!");
    if (menuMissing) toast.error("No menu items available.");
    if (tableInvalid) toast.error("Invalid table number in QR link!");
  }, [restaurantMissing, menuMissing, tableInvalid]);

  return null;
}
