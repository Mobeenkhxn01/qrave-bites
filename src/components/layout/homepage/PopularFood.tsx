"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PopularFood() {
  return (
    <section className="w-full bg-white py-24 sm:py-20">
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

          <motion.p className="mt-4 text-gray-600 text-sm sm:text-base">
            QR-based ordering, instant payments, real-time kitchen alerts, and
            smart analytics — all in one system.
          </motion.p>
        </motion.div>

  
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
          {[
            {
              title: "Smart QR Food Ordering System",
              desc: "End-to-end QR-based food ordering system with table-wise ordering, instant payments, and real-time kitchen notifications.",
              img: "/Qr_code_scanning_image.png",
              link: "/qr-code-ordering-system",
            },
            {
              title: "Restaurant Admin & Management Panel",
              desc: "Powerful admin dashboard to manage restaurant operations, menu, tables, and users — all in one place.",
              img: "/admin_panel.png",
              link: "/restaurant-management-system",
            },
            {
              title: "Restaurant Analytics & Insights",
              desc: "Real-time analytics to track restaurant performance and make data-driven decisions.",
              img: "/analytics.png",
              link: "/restaurant-analytics-system",
            },
            {
              title: "Custom Restaurant Website & Menu Page",
              desc: "Customer-facing restaurant page with dynamic menu, table-based ordering, and shareable links.",
              img: "/Custom_web.png",
              link: "/restaurant-website-builder",
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
              <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl pb-0">

                <CardHeader className="space-y-3 flex-1">
                  <motion.h2
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl sm:text-2xl font-bold line-clamp-2"
                  >
                    {item.title}
                  </motion.h2>

                  <motion.p className="text-gray-600 text-sm sm:text-base line-clamp-3">
                    {item.desc}
                  </motion.p>

                  <div className="pt-2 mt-auto">
                    <Link
                      href={item.link}
                      className="text-blue-600 font-medium inline-flex items-center gap-1"
                    >
                      Know More →
                    </Link>
                  </div>
                </CardHeader>

                <CardFooter className="relative h-60 sm:h-75 md:h-90 p-0  overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      pointerEvents: "auto",
                    }}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4="
                    />
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
