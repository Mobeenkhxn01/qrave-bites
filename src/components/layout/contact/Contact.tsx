"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, type Variants } from "framer-motion";

export default function Contact() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="w-full bg-white font-sans py-20 px-4">
      <motion.div
        className="mx-auto max-w-5xl flex flex-col items-center text-center gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-120px" }}
      >
        <motion.h1
          variants={itemVariants}
          className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight"
        >
          Build and grow your business with QraveBites
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-sm sm:text-base md:text-lg max-w-3xl"
        >
          Manage orders, payments, analytics, and customer experience from one
          powerful platform designed for modern restaurants.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="w-full max-w-md flex flex-col sm:flex-row gap-3 bg-white border rounded-full p-2 shadow-sm"
        >
          <Input
            placeholder="Enter your phone number"
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
          <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700">
            Request Callback
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
