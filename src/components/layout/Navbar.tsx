"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRightIcon, Menu } from "lucide-react";
import { CartIcon } from "../menu/CartIcon";
import { usePathname } from "next/navigation";
import { IoRestaurant } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchUserProfile = async () => {
  const response = await axios.get("/api/profile");
  return response.data;
};

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    enabled: !!session,
  });

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/menu", label: "Food Menu" },
    { href: "/#chef", label: "Chef" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/#blog", label: "Blog" },
  ];

  return (
    <header className="bg-white w-full h-20 flex justify-between items-center z-50 px-4 md:px-8 shadow-md">
      {/* Logo */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" className="font-serif font-extrabold text-black flex items-center gap-2 text-2xl">
              <IoRestaurant />
              <span className="text-[#d19b6f]">QraveBites</span>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="flex gap-4">
          {navLinks.map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <Link
                href={href}
                className={`capitalize font-serif transition-colors ${
                  pathname === href ? "text-[#d19b6f]" : "text-[#010f1c] hover:text-[#d19b6f]"
                }`}
              >
                {label}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* User + Cart + Mobile Menu */}
      <div className="flex gap-4 items-center">
        {session ? (
          <>
            {/* ✅ Display fetched name */}
            <Link href="/profile" className="text-black font-serif">
              {isLoading ? "Loading..." : `Hello, ${userProfile?.name || "User"}`}
            </Link>

            <Button
              onClick={() => signOut()}
              className="font-serif text-white bg-[#eb0029] hover:bg-[#d19b6f]"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button className="font-serif text-white bg-[#eb0029] hover:bg-[#d19b6f]">
              Login
            </Button>
          </Link>
        )}

        {/* Cart Icon */}
        <CartIcon />

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border border-gray-300 text-black">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-white text-[#010f1c]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium p-4">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="hover:text-[#d19b6f]">
                  {label}
                </Link>
              ))}
              {session ? (
                <Button
                  onClick={() => signOut()}
                  className="bg-[#eb0029] hover:bg-[#d19b6f] w-full text-white"
                >
                  Logout
                </Button>
              ) : (
                <Link href="/login" className="w-full">
                  <Button className="bg-[#eb0029] hover:bg-[#d19b6f] w-full text-white">
                    Login
                  </Button>
                </Link>
              )}
              <Button className="w-full py-6 font-serif font-semibold text-white rounded-none bg-[#eb0029] hover:bg-[#d19b6f]">
                Order Now
                <ArrowRightIcon className="ml-4 bg-white text-[#eb0029] rounded-full p-1" />
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
