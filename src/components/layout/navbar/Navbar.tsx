"use client";

import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import CartSection from "./CartSection";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="bg-white w-full h-20 flex justify-between items-center z-50 px-4 md:px-8 shadow-md">
      {/* Logo */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Logo />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop Navigation */}
      <NavLinks />

      {/* User + Cart + Mobile Menu */}
      <div className="flex gap-4 items-center">
        <UserMenu />
        <CartSection />
        <MobileMenu />
      </div>
    </header>
  );
}
