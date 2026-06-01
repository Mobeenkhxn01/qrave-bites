import { Button } from "@/components/ui/button";

export default function ManageBillingButton() {
  const handlePortal = async () => {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <Button onClick={handlePortal}>
      Manage Billing
    </Button>
  );
}