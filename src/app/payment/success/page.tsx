import OrderClient from "./OrderClient";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <div className="p-10 text-center text-red-500">
        Order not found
      </div>
    );
  }

  return <OrderClient orderId={orderId} />;
}
