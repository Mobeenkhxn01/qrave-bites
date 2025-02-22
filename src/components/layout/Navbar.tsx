"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRightIcon, Menu } from "lucide-react";
import { IoCartOutline } from "react-icons/io5";

export default function NavigationMenuDemo() {
  
  const { data: session } = useSession();

  return (
    <div className="bg-[#fff] w-full h-20 flex justify-between items-center sticky top-0 z-50 px-4 md:px-8">
      {/* Logo */}
      <NavigationMenu>
        <NavigationMenuItem>
          <Link href="/" className="text-bold font-serif text-black font-extrabold">
            <span className="text-[#d19b6f]">QraveBites</span>
          </Link>
        </NavigationMenuItem>
      </NavigationMenu>

      {/* Desktop Menu */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="flex gap-4">
          <NavigationMenuItem>
            <Link href="/" className="capitalize font-serif text-[#010f1c]">
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/about" className="font-serif">About Us</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/food-menu" className="font-serif">Food Menu</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/#chef" className="font-serif">Chef</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/#gallery" className="font-serif">Gallery</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/#blog" className="font-serif">Blog</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Menu & User Section */}
      <div className="flex flex-row gap-4 items-center justify-center">
        {/* Auth State: Show login or username */}
        {session ? (
          <>
            <span className="text-black font-serif">Hello, {session.user?.name}</span>
            <Button onClick={() => signOut()} className="font-serif text-white bg-[#eb0029]">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button className="font-serif text-white bg-[#eb0029]">Login</Button>
          </Link>
        )}

        {/* Cart Icon */}
        <Link href="/cart">
          <IoCartOutline className="w-6 h-6" />
        </Link>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 text-black border-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#fff] text-[#010f1c]">
            <nav className="grid gap-6 text-lg font-medium p-4">
              <Link href="/" className="hover:text-[#d19b6f]">Home</Link>
              <Link href="/menu" className="hover:text-[#d19b6f]">Menu</Link>
              <Link href="/ourstory" className="hover:text-[#d19b6f]">Our Story</Link>
              <Link href="/#contact" className="hover:text-[#d19b6f]">Contact Us</Link>
              <Link href="/login" className="hover:text-[#d19b6f]">Login</Link>
              <div className="w-full">
                <Button className="w-full p-8 font-serif font-semibold text-white border-none rounded-none bg-[#eb0029]">
                  Order Now
                  <ArrowRightIcon className="ml-4 bg-white text-[#eb0029]" />
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
