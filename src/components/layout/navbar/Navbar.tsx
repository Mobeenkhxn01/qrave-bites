"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import UserMenu from "./UserMenu";

export default function FloatingNavbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80); // adjust threshold
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100 bg-white shadow-md"
          : "-translate-y-full opacity-0"
      )}
    >
      <div className="h-16 px-4 md:px-8 flex items-center justify-between">
        <Logo />
        <div className="flex gap-4 ">
        <UserMenu/>
        <Link href="/partner-with-us">
          <Button className="bg-[#006aff] text-white">
            Request Demo
          </Button>
        </Link>
        </div>
      </div>
    </header>
  );
}
