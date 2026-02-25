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
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, margin: "0px 0px -100px 0px" }}
            className="
              flex items-center justify-center gap-4 sm:gap-6 xl:gap-8 py-20
              scale-50 sm:scale-75 md:scale-90 xl:scale-100
            "
          >
            <div className="
              relative
              w-105 h-90
              sm:w-150 sm:h-100
              md:w-170 md:h-110
              xl:w-190 xl:h-120
              rounded-3xl overflow-hidden
              -ml-52.5 sm:-ml-70 md:-ml-85 xl:-ml-95
            ">
              <Image
                src="/desk_counter.png"
                alt="Restaurant interior"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="
              relative
              w-40 h-70
              sm:w-50 sm:h-85
              md:w-55 md:h-95
              xl:w-62.5 xl:h-105
              rounded-2xl overflow-hidden translate-y-14
            ">
              <Image
                src="/Qr_code_scanning_image.png"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>

            <div className="
              relative
              w-40 h-70
              sm:w-50 sm:h-85
              md:w-55 md:h-95
              xl:w-62.5 xl:h-105
              rounded-2xl overflow-hidden -translate-y-14
            ">
              <Image
                src="/Custom_web.png"
                alt="Burger"
                fill
                className="object-cover"
              />
            </div>

            <div className="
              relative
              w-105 h-90
              sm:w-150 sm:h-100
              md:w-170 md:h-110
              xl:w-190 xl:h-120
              rounded-3xl overflow-hidden
              -mr-52.5 sm:-mr-70 md:-mr-85 xl:-mr-95
            ">
              <Image
                src="/chef_img.png"
                alt="Restaurant ambience"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
