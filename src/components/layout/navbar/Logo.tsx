"use client";

import Link from "next/link";
import { IoRestaurant } from "react-icons/io5";

export default function Logo() {
  return (
    <Link
      href="/"
      className="font-serif font-extrabold text-black flex items-center gap-2 text-2xl"
    >
      <IoRestaurant />
      <span className="text-[#d19b6f]">QraveBites</span>
    </Link>
  );
}
