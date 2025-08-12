"use client";
import * as React from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import { IoMdArrowForward } from "react-icons/io";

export default function Hero() {
  return (
    <div className="w-full flex flex-col md:flex-row relative ">
      <div>
        <Image
          className="object-cover"
          src={"/bannerBG1_1.jpg"}
          alt="meal image"
          fill
        />
      </div>
      {/* Left section with text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-4 min-h-[300px] md:min-h-screen   z-10">
        <h1 className=" uppercase font-roboto text-2xl  font-extrabold text-[#fc791a]">
          Welcome To Qrave Bites
        </h1>
        <h1 className="uppercase font-roboto text-6xl  font-extrabold text-white">
        “Scan Your Table's QR, Order Instantly.
        Savor the Meal—Not the Wait.”
        </h1>
        <div className="flex flex-col md:flex-row gap-2 p-3 justify-center">
          <Button  className=" bg-[#eb0029] m-4 p-8 text-xl rounded-none hover:bg-[#fc791a] ">
            Order Now
            <IoMdArrowForward className=" ml-4 bg-white text-[#eb0029]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
