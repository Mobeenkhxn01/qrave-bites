import { Suspense } from "react";
import PartnerContractClient from "./partner-contract-client";

export default function PartnerContractPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PartnerContractClient />
    </Suspense>
  );
}
