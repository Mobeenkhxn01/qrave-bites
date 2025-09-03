
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ArrowRightIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { navLinks } from "./NavLinks";

export default function MobileMenu() {
  const { data: session } = useSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border border-gray-300 text-black"
        >
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
  );
}
