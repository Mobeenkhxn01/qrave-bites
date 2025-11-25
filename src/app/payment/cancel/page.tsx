export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600">Payment Cancelled ❌</h1>
      <p className="mt-4 text-gray-600">
        Your payment was cancelled. You can try again.
      </p>

      <a
        href="/cart"
        className="mt-6 px-6 py-3 bg-black text-white rounded"
      >
        Return to Cart
      </a>
    </div>
  );
}
