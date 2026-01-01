"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { ContactDialog } from "../ContactDialog";
import { motion } from "framer-motion";

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full wave-bg overflow-hidden">
      <div className="mx-auto w-full py-16 lg:py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight">
            Power your restaurant
            <br />
            with <span className="text-blue-400">QraveBites</span>
          </h1>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[#ae9bf1] text-sm sm:text-base">
            <span>QR Ordering</span>
            <span>Inventory</span>
            <span>Online Store</span>
            <span>Payments</span>
            <span>Analytics</span>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="mt-10 px-14 py-8 rounded-full bg-[#006aff] text-white font-sans text-lg sm:text-xl hover:bg-blue-900 transition"
          >
            Get Started
          </Button>

          <ContactDialog open={open} onOpenChange={setOpen} />
        </motion.div>

        <div className="relative w-full mt-20 overflow-hidden">
          {/* XL layout */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, margin: "0px 0px -100px 0px" }}
            className="hidden xl:flex items-center justify-center gap-8 py-20"
          >
            <div className="relative w-190 h-120 rounded-3xl overflow-hidden -ml-95">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="relative w-62.5 h-105 rounded-2xl overflow-hidden translate-y-14">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-62.5 h-105 rounded-2xl overflow-hidden -translate-y-14">
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
                alt="Burger"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-190 h-120 rounded-3xl overflow-hidden -mr-95">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Restaurant ambience"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* MD layout */}
          <div className="hidden md:flex xl:hidden items-center justify-center gap-6">
            <div className="relative w-105 h-90 rounded-2xl overflow-hidden -ml-52.5">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-75 h-95 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-105 h-90 rounded-2xl overflow-hidden -mr-52.5">
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
                alt="Burger"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Mobile layout */}
          <div className="flex md:hidden flex-col gap-4 px-4">
            <div className="relative w-full h-65 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-full h-65 rounded-2xl overflow-hidden">
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
