import { Suspense } from "react";
import RestaurantDocumentClient from "./restaurant-documents-client";

export default function RestaurantDocumentsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <RestaurantDocumentClient />
    </Suspense>
  );
}
