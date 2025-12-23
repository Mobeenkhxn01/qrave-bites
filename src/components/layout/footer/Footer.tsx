import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-10">
      <div className="mx-auto max-w-7xl px-6">

        {/* ===== TOP LINKS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-center sm:text-left">
          {/* Business */}
          <div>
            <h3 className="text-gray-400 mb-4 font-medium">Business</h3>
            <ul className="space-y-2 ">
              <li>QR Store</li>
              <li>Inventory Management</li>
              <li>Payment</li>
              <li>Order</li>
              <li>Solutions</li>
            </ul>
          </div>

          {/* QraveBites */}
          <div>
            <h3 className="text-gray-400 mb-4 font-medium">QraveBites</h3>
            <ul className="space-y-2">
              <li>Contact Us</li>
              <li>Request Demo</li>
              <li>Privacy Policy</li>
              <li>About Us</li>
              <li>Home</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-10 bg-gray-700" />

        {/* ===== BOTTOM BAR ===== */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 items-center justify-between text-sm text-gray-300 pb-8">

          {/* Copyright */}
          <p className="text-center sm:text-left">
            © QraveBites | All Rights Reserved
          </p>

          {/* Links + Social */}
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-white transition">
              Terms & Conditions
            </span>

            <Link href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <FiLinkedin size={18} />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-white transition">
              <FiInstagram size={18} />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-white transition">
              <FiTwitter size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
