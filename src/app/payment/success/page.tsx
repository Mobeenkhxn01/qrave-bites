export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-4 text-gray-600">
        Thank you! Your order has been placed.
      </p>

      <a
        href="/"
        className="mt-6 px-6 py-3 bg-black text-white rounded"
      >
        Go Back Home
      </a>
    </div>
  );
}
