import { Suspense } from "react";
import CartClient from "./cart-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CartClient />
    </Suspense>
  );
}
