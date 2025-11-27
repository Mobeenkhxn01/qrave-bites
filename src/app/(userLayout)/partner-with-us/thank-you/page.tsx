import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-6">
        Thank you for registering your restaurant 🎉
      </h1>

      <p className="text-gray-600 text-center mb-10 max-w-md">
        Your restaurant details have been submitted successfully.  
        Our team will review and activate your partner dashboard soon.
      </p>

      <Link
        href="/dashboard"
        className="bg-[#eb0029] hover:bg-[#c30023] transition-all text-white px-6 py-3 rounded-2xl text-lg font-medium shadow-md"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
