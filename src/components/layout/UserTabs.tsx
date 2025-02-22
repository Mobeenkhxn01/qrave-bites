"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function UserTabs() {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-4 justify-center flex-wrap mb-6">
      <div className="">
        <Link
          href="/profile"
          className={`${
            path === "/profile" ? "bg-[#f13a01] text-white" : "bg-transparent"
          } px-4 py-2 rounded-full border border-gray-300 `}
        >
          Profile
        </Link>
      </div>

      <div>
        <Link
          href="/categories"
          className={`${
            path === "/categories" ? "bg-[#f13a01] text-white" : "bg-transparent"
          } px-4 py-2 rounded-full border border-gray-300 `}
        >
          Categories
        </Link>
      </div>

      <div>
        <Link
          href="/menu-items"
          className={`${
            path==="/menu-items" ? "bg-[#f13a01] text-white" : "bg-transparent"
          } px-4 py-2 rounded-full border border-gray-300 `}
        >
          Menu Items
        </Link>
      </div>

      <div>
        <Link
          href="/users"
          className={`${
            path==="/users" ? "bg-[#f13a01] text-white" : "bg-transparent"
          } px-4 py-2 rounded-full border border-gray-300`}
        >
          Users
        </Link>
      </div>

      <div>
        <Link
          href="/orders"
          className={`${
            path === "/orders" ? "bg-[#f13a01] text-white" : "bg-transparent"
          } px-4 py-2 rounded-full border border-gray-300  `}
        >
          Orders
        </Link>
      </div>
    </div>
  );
}
