import { Suspense } from "react";
import MenuClient from "./menu-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading menu...</div>}>
      <MenuClient />
    </Suspense>
  );
}
