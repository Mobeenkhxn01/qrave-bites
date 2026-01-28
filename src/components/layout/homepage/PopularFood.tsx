"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PopularFood() {
  return (
    <section className="w-full mt-30  bg-white py-24 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, margin: "0px 0px -100px 0px" }}
          className="text-center"
        >
          <motion.h1
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          >
            One platform.{" "}
            <span className="text-blue-800">Four powerful tools.</span>
            <br className="hidden sm:block" />
            Built to grow modern restaurants.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-gray-600 text-sm sm:text-base"
          >
            QR-based ordering, instant payments, real-time kitchen alerts, and
            smart analytics — all in one system.
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              title: "Smart QR Food Ordering System",
              desc: "End-to-end QR-based food ordering system with table-wise ordering, instant payments, and real-time kitchen notifications.",
              img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
            },
            {
              title: "Restaurant Admin & Management Panel",
              desc: "Powerful admin dashboard to manage restaurant operations, menu, tables, and users — all in one place.",
              img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
            },
            {
              title: "Restaurant Analytics & Insights",
              desc: "Real-time analytics to track restaurant performance and make data-driven decisions.",
              img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
            },
            {
              title: "Custom Restaurant Website & Menu Page",
              desc: "Customer-facing restaurant page with dynamic menu, table-based ordering, and shareable links.",
              img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: false, margin: "0px 0px -100px 0px" }}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-2xl pb-0">
                  <CardHeader className="space-y-3">
                    <motion.h2
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl sm:text-2xl font-bold"
                    >
                      {item.title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-600 text-sm sm:text-base"
                    >
                      {item.desc}
                    </motion.p>

                    <motion.div
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.3 }}
                      className="w-fit"
                    >
                      <Link
                        href="/know-more"
                        className="text-blue-600 font-medium"
                      >
                        Know More →
                      </Link>
                    </motion.div>
                  </CardHeader>

                  <CardFooter className="relative h-60 sm:h-75 md:h-90 p-0 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={item.img || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
