"use client";
import Image from "next/image";
import { IoMdArrowForward } from "react-icons/io";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full flex flex-col md:flex-row relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          className="object-cover"
          src="/bannerBG1_1.jpg"
          alt="meal image"
          fill
          priority
        />
      </div>

      {/* Left Section */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center items-start p-4 min-h-[300px] md:min-h-screen bg-black/50 md:bg-transparent">
        <h1 className="uppercase font-roboto text-2xl font-extrabold text-[#fc791a]">
          Welcome To Qrave Bites
        </h1>
        <h1 className="uppercase font-roboto text-4xl md:text-6xl font-extrabold text-white mt-4 leading-tight">
          “Scan Your Table's QR, Order Instantly.
          <br />
          Savor the Meal—Not the Wait.”
        </h1>

        <div className="flex flex-col md:flex-row gap-2 mt-6">
          <Link href={"/menu"} className="bg-[#eb0029] px-6 py-4 text-lg rounded-none hover:bg-[#fc791a] flex items-center">
         
            Order Now
            <IoMdArrowForward className="ml-3 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}