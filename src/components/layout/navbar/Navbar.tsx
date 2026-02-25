"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import UserMenu from "./UserMenu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {ContactDialog} from "@/components/layout/ContactDialog";

export default function FloatingNavbar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isOwner =
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "RESTAURANT_OWNER";

  const handleCTA = () => {

    if (!session) {
      router.push("/login");
      return;
    }
    if (isOwner) {
      router.push("/dashboard");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          visible
            ? "translate-y-0 opacity-100 bg-white shadow-md"
            : "-translate-y-full opacity-0"
        )}
      >
        <div className="h-16 px-4 md:px-8 flex items-center justify-between">
          <Logo />

          <div className="flex gap-4 items-center">
            <UserMenu />

            <Button
              className="font-serif text-white bg-[#006aff] hover:bg-[#d19b6f]"
              onClick={handleCTA}
            >
              {isOwner ? "Dashboard" : "Request a Demo"}
            </Button>
          </div>
        </div>
      </header>

      <ContactDialog open={open} onOpenChange={setOpen} />
    </>
  );
}