"use client";

import { Button } from "@/components/ui/button";

export default function UpgradeButton() {
  const handlePortal = async () => {
    const res = await fetch("/api/stripe/checkout-subscribe", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <Button onClick={handlePortal}>
      Upgrade
    </Button>
  );
}