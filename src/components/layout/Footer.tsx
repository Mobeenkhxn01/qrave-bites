import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { ArrowBigRightIcon, MailIcon, PhoneCallIcon } from "lucide-react";
import Link from "next/link";
import { FiFacebook } from "react-icons/fi";
import { IoLocationSharp, IoLogoWhatsapp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Label } from "../ui/label";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#212529] pt-6 mt-6 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0">
        <Image
          className="w-[8rem] md:w-[16rem]"
          src="/footerShape1_4 (1).png"
          alt="Decorative shape"
          width={512}
          height={512}
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <Image
          className="w-[8rem] md:w-[16rem]"
          src="/footerShape1_2 (1).png"
          alt="Decorative shape"
          width={512}
          height={512}
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <Image
          className="w-[8rem] md:w-[16rem]"
          src="/footerShape1_1.png"
          alt="Decorative shape"
          width={512}
          height={512}
        />
      </div>

      {/* Contact Bar */}
      <div className="relative z-10 w-10/12 mx-auto flex flex-col md:flex-row justify-between rounded-2xl items-start md:items-center text-white p-6 bg-[#fc791a] font-bold">
        <ContactItem
          icon={<IoLocationSharp className="w-6 h-6 text-[#eb0029]" />}
          title="Address"
          text="Kharar Mohali, Punjab, 140413"
        />
        <ContactItem
          icon={<MailIcon className="w-6 h-6 text-[#eb0029]" />}
          title="Email"
          text="qravebites@gmail.com"
        />
        <ContactItem
          icon={<PhoneCallIcon className="w-6 h-6 text-[#eb0029]" />}
          title="Contact"
          text="+91 6303660509"
        />
      </div>

      {/* Footer Main */}
      <div className="relative z-10 w-10/12 mx-auto flex flex-col md:flex-row justify-between mt-8 text-white gap-8">
        {/* Brand + Social */}
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

        {/* Contact Us / Newsletter */}
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

      {/* Bottom Bar */}
      <div className="relative z-10 w-full mt-24 bg-[#eb0029] h-16 flex flex-col md:flex-row justify-between items-center px-4 text-sm">
        <p className="text-white">© 2024 QraveBites. All Rights Reserved</p>
        <div className="flex gap-4">
          <Link href="/terms" className="text-white hover:underline">
            Terms and Conditions
          </Link>
          <Link href="/privacy" className="text-white hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* Reusable Components */
function ContactItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          {icon}
        </div>
        {title}
      </div>
      <span>{text}</span>
    </div>
  );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-[#eb0029] p-2 border border-white transition-colors"
    >
      {children}
    </Link>
  );
}

function FooterLinks({ title, links }: { title: string; links: { href: string; text: string }[] }) {
  return (
    <div className="w-full md:w-1/4 flex flex-col gap-3">
      <div className="text-2xl font-extrabold">{title}</div>
      {links.map((link, idx) => (
        <Link key={idx} href={link.href} className="hover:text-[#eb0029]">
          {link.text}
        </Link>
      ))}
    </div>
  );
}
