import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import {
  
  ArrowBigRightIcon,
  
  MailIcon,
  PhoneCallIcon,
} from "lucide-react";
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
      <div className="w-full bg-[#212529] flex flex-col items-center justify-center mt-6 pt-6 relative">
        <div className="absolute top-0 right-0 w-30 h-30 z-1">
          <Image
            className="w-[8rem] md:w-[16rem]"
            src={"/footerShape1_4 (1).png"}
            alt="logo"
            width={512}
            height={512}
          />
        </div>
  
        <div className="absolute bottom-0 left-0 w-30 h-30 z-1">
          <Image
            className="w-[8rem] md:w-[16rem]"
            src={"/footerShape1_2 (1).png"}
            alt="logo"
            width={512}
            height={512}
          />
        </div>
  
        <div className="absolute bottom-0 left-0 w-[8rem] md:w-[16rem] z-1">
          <Image src={"/footerShape1_1.png"} alt="logo" width={512} height={512} />
        </div>
  
        <div className="w-10/12 flex flex-col md:flex-row justify-between rounded-2xl item-start md:items-center text-white p-6 bg-[#fc791a] font-bold relative z-3">
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <IoLocationSharp className="w-6 h-6 text-[#eb0029]" />
              </div>
              Address
            </div>
            Kharar Mohali, Punjab, 140413
          </div>
  
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <MailIcon className="w-6 h-6 text-[#eb0029]" />
              </div>
              Email
            </div>
            qravebites@gmail.com
          </div>
  
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <PhoneCallIcon className="w-6 h-6 text-[#eb0029]" />
              </div>
              Contact
            </div>
            +91 6303660509
          </div>
        </div>
  
        <div className="w-10/12 flex flex-col md:flex-row justify-between mt-8 text-white relative z-2">
          <div className="w-full md:w-1/4 flex flex-col gap-6">
            <Link href="/" className="text-2xl font-extrabold">QraveBites</Link>
            <p>Your order will be on your table </p>
            <div className="flex flex-row gap-2">
              {/* Social Media Icons */}
              <Link href="https://www.facebook.com/musclemeals/" className="hover:bg-[#eb0029] p-2 border-2 border-solid border-white">
                <FiFacebook className="w-6 h-6 text-white" />
              </Link>
              <Link href="https://twitter.com/musclemeals" className="hover:bg-[#eb0029] p-2 border-2 border-solid border-white">
                <TwitterLogoIcon className="w-6 h-6 text-white" />
              </Link>
              <Link href="https://www.instagram.com/musclemeals/" className="hover:bg-[#eb0029] p-2 border-2 border-solid border-white">
                <InstagramLogoIcon className="w-6 h-6 text-white" />
              </Link>
              <Link href="https://wa.me/+916305938848" className="hover:bg-[#eb0029] p-2 border-2 border-solid border-white">
                <IoLogoWhatsapp className="w-6 h-6 text-white" />
              </Link>
            </div>
          </div>
  
          <div className="w-full md:w-1/4 flex flex-col gap-6">
            <div className="text-2xl font-extrabold">Quick Links</div>
            {/* Links */}
            <Link href="/about" className="hover:text-[#eb0029]">About</Link>
            <Link href="/contact" className="hover:text-[#eb0029]">Contact</Link>
            <Link href="/menu" className="hover:text-[#eb0029]">Menu</Link>
            <Link href="/blog" className="hover:text-[#eb0029]">Blog</Link>
            <Link href="/gallery" className="hover:text-[#eb0029]">Gallery</Link>
          </div>
  
          <div className="w-full md:w-1/4 flex flex-col gap-6">
            <div className="text-2xl font-extrabold">Our Menu</div>
            <Link href="/protein" className="hover:text-[#eb0029]">Protein Diet</Link>
            <Link href="/fibre" className="hover:text-[#eb0029]">Fibre Rich</Link>
            <Link href="/veg" className="hover:text-[#eb0029]">Vegetarian</Link>
            <Link href="/nonveg" className="hover:text-[#eb0029]">Non-Veg</Link>
            <Link href="/carbs" className="hover:text-[#eb0029]">Carbs Rich</Link>
          </div>
  
          <div className="w-full md:w-1/4 flex flex-col gap-6">
            <div className="text-2xl font-extrabold">Contact Us</div>
            <div>Monday-Friday: 9:00 AM - 6:00 PM</div>
            <div>Saturday: 9:00 AM - 4:00 PM</div>
            <div className="flex items-center bg-white text-black p-2 rounded-md gap-2">
              <Input type="email" placeholder="Email" />
              <Button className="bg-[#eb0029] hover:bg-[#fc791a]">
                <ArrowBigRightIcon className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" className="w-4 h-4 bg-white" />
              <Label htmlFor="terms" className="text-sm">Subscribe to our newsletter</Label>
            </div>
          </div>
        </div>
  
        <div className="w-full mt-24 bg-[#eb0029] h-16 flex justify-between items-center p-4  relative z-2">
          <p className="text-white">Copyright © 2024. All Rights Reserved</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-white hover:underline">Terms and Conditions</Link>
            <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    );
  }
  
