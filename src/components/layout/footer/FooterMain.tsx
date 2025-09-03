import Link from "next/link";
import FooterLinks from "./FooterLinks";
import SocialLink from "./SocialLinks";
import { FiFacebook } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io5";
import { TwitterLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigRightIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function FooterMain() {
  return (
    <div className="relative z-10 w-10/12 mx-auto flex flex-col md:flex-row justify-between mt-8 text-white gap-8">
      {/* Brand + Social Links */}
      <div className="w-full md:w-1/4 flex flex-col gap-6">
        <Link href="/" className="text-2xl font-extrabold">
          QraveBites
        </Link>
        <p>Your order will be on your table</p>
        <div className="flex gap-2">
          <SocialLink href="https://www.facebook.com/mobeenkhan02/">
            <FiFacebook className="w-6 h-6" />
          </SocialLink>
          <SocialLink href="https://twitter.com/errornotfound33">
            <TwitterLogoIcon className="w-6 h-6" />
          </SocialLink>
          <SocialLink href="https://www.instagram.com/mobeenkhxn01/">
            <InstagramLogoIcon className="w-6 h-6" />
          </SocialLink>
          <SocialLink href="https://wa.me/+916303660509">
            <IoLogoWhatsapp className="w-6 h-6" />
          </SocialLink>
        </div>
      </div>

      {/* Quick Links */}
      <FooterLinks
        title="Quick Links"
        links={[
          { href: "/about", text: "About" },
          { href: "/contact", text: "Contact" },
          { href: "/menu", text: "Menu" },
          { href: "/blog", text: "Blog" },
          { href: "/partner-with-us", text: "Partner-with-us" },
        ]}
      />

      {/* Menu Links */}
      <FooterLinks
        title="Our Menu"
        links={[
          { href: "/chinese", text: "Chinese" },
          { href: "/italian", text: "Italian" },
          { href: "/veg", text: "Vegetarian" },
          { href: "/nonveg", text: "Non-Veg" },
          { href: "/south-indian", text: "South-Indian" },
        ]}
      />

      {/* Newsletter */}
      <div className="w-full md:w-1/4 flex flex-col gap-6">
        <div className="text-2xl font-extrabold">Contact Us</div>
        <div>Monday-Friday: 9:00 AM - 6:00 PM</div>
        <div>Saturday: 9:00 AM - 4:00 PM</div>
        <form className="flex items-center bg-white text-black p-2 rounded-md gap-2">
          <Input type="email" placeholder="Email" className="flex-1" />
          <Button className="bg-[#eb0029] hover:bg-[#fc791a] p-2">
            <ArrowBigRightIcon className="w-6 h-6" />
          </Button>
        </form>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" className="w-4 h-4 bg-white" />
          <Label htmlFor="terms" className="text-sm">
            Subscribe to our newsletter
          </Label>
        </div>
      </div>
    </div>
  );
}
