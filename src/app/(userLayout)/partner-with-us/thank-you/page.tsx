import { Suspense } from "react";
import ThankYouClient from "./thank-you-client";

export default function RestaurantDocumentsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}
