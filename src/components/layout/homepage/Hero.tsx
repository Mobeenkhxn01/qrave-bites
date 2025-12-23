"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { ContactDialog } from "../ContactDialog";

export default function Hero() {
  const [open, setOpen] = useState(false);
  return (
    <section className="w-full bg-blue-950 overflow-hidden">
      <div className="mx-auto w-full  py-16 lg:py-24 flex flex-col items-center text-center">
        <div className="max-w-5xl">
          <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight">
            Power your business with Qrave-bites
          </h1>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[#ae9bf1] text-sm sm:text-base">
            <span>QR Solution</span>
            <span>Inventory Management</span>
            <span>Online Store</span>
            <span>Payment Integration</span>
            <span>Orders</span>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="mt-10 px-14 py-8 rounded-full bg-[#006aff] text-white font-sans text-xl hover:bg-blue-900 transition"
          >
            Get Started
          </Button>

          <ContactDialog open={open} onOpenChange={setOpen} />
        </div>

        {/* ================= IMAGES ================= */}
        <div className="relative w-full mt-16 overflow-hidden">
          {/* ===== DESKTOP ===== */}
          <div className="hidden xl:flex items-center justify-center gap-8 py-20">
            {/* LEFT HALF */}
            <div className="relative w-[760px] h-[480px] rounded-3xl overflow-hidden -ml-[380px]">
              <Image
                src={
                  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80 "
                }
                alt="Restaurant interior"
                fill
                className="object-cover "
                priority
              />
            </div>

            {/* SMALL 1 */}
            <div className="relative w-[250px] h-[420px] rounded-2xl overflow-hidden  translate-y-14">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>

            {/* SMALL 2 */}
            <div className="relative w-[250px] h-[420px] rounded-2xl overflow-hidden -translate-y-14">
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
                alt="Burger"
                fill
                className="object-cover"
              />
            </div>

            {/* RIGHT HALF */}
            <div className="relative w-[760px] h-[480px] rounded-3xl overflow-hidden -mr-[380px]">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Restaurant ambience"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* ===== TABLET ===== */}
          <div className="hidden md:flex xl:hidden items-center justify-center gap-6">
            <div className="relative w-[420px] h-[360px] rounded-2xl overflow-hidden -ml-[210px]">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-[300px] h-[380px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-[420px] h-[360px] rounded-2xl overflow-hidden -mr-[210px]">
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
                alt="Burger"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* ===== MOBILE ===== */}
          <div className="flex md:hidden flex-col gap-4">
            <div className="relative w-full h-[260px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-full h-[260px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
