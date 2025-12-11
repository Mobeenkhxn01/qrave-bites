import { Suspense } from "react";
import NewClient from "./new-client";

export default function RestaurantDocumentsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <NewClient />
    </Suspense>
  );
}
