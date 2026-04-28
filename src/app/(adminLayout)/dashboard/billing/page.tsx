import UpgradeButton from "./UpgradeButton";
import ManageBillingButton from "./ManageBillingButton";
import { auth } from "@/lib/auth";

export default async function BillingPage() {
  const session = await auth();

  const plan = session?.user?.plan;
  const trialEndsAt = session?.user?.trialEndsAt;
  const subscriptionStatus = session?.user?.subscriptionStatus;

  const isActive = subscriptionStatus === "active";

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <div className="rounded-xl border p-6 space-y-3">
        <p><strong>Current Plan:</strong> {plan ?? "FREE"}</p>

        {trialEndsAt && (
          <p>
            Trial ends: {new Date(trialEndsAt).toLocaleDateString()}
          </p>
        )}

        {!isActive ? (
          <UpgradeButton />
        ) : (
          <ManageBillingButton />
        )}
      </div>
    </div>
  )
}
