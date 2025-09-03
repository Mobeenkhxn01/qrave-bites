"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/menu", label: "Food Menu" },
  { href: "/#chef", label: "Chef" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#blog", label: "Blog" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex gap-4">
        {navLinks.map(({ href, label }) => (
          <NavigationMenuItem key={href}>
            <Link
              href={href}
              className={`capitalize font-serif transition-colors ${
                pathname === href
                  ? "text-[#d19b6f]"
                  : "text-[#010f1c] hover:text-[#d19b6f]"
              }`}
            >
              {label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export { navLinks };
