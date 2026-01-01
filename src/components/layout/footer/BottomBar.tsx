import Link from "next/link";

export default function BottomBar() {
  return (
    <div className="relative z-10 w-full mt-24 bg-[#eb0029] h-16 flex flex-col md:flex-row justify-between items-center px-4 text-sm">
      <p className="text-white">© 2024 QraveBites. All Rights Reserved</p>
      <div className="flex gap-4">
        <Link href="/terms" className="text-white hover:underline">
          Terms and Conditions
        </Link>
        <Link href="/privacy" className="text-white hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
