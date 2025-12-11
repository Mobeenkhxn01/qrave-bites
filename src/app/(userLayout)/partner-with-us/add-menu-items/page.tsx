import { Suspense } from "react";
import AddMenuItemsClient from "./add-menu-items-client";

export default function RestaurantDocumentsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <AddMenuItemsClient />
    </Suspense>
  );
}
