"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function PopularFood() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 flex gap-8 flex-col">
        <div className="px-36 py-10">

        <h1 className="font-sans text-center text-5xl font-bold">
          Flexible <span className="text-blue-800">business solutions</span> for
          omni-channel selling
        </h1>
        </div>

  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ===== CARD 1 ===== */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-2">
              <h1 className="text-2xl font-bold">POS</h1>
              <p className="text-gray-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Maiores,
              </p>
              <Link href="/know-more" className="text-blue-600 font-medium">
                Know More →
              </Link>
            </CardHeader>

            <CardFooter className="relative h-[280px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
                priority
              />
            </CardFooter>
          </Card>

          {/* ===== CARD 2 ===== */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-2">
              <h1 className="text-2xl font-bold">Online Store</h1>
              <p className="text-gray-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Maiores,
              </p>
              <Link href="/know-more" className="text-blue-600 font-medium">
                Know More →
              </Link>
            </CardHeader>

            <CardFooter className="relative h-[280px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Online store"
                fill
                className="object-cover"
              />
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ===== CARD 1 ===== */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-2">
              <h1 className="text-2xl font-bold">POS</h1>
              <p className="text-gray-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Maiores,
              </p>
              <Link href="/know-more" className="text-blue-600 font-medium">
                Know More →
              </Link>
            </CardHeader>

            <CardFooter className="relative h-[280px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
                priority
              />
            </CardFooter>
          </Card>

          {/* ===== CARD 2 ===== */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-2">
              <h1 className="text-2xl font-bold">Online Store</h1>
              <p className="text-gray-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Maiores,
              </p>
              <Link href="/know-more" className="text-blue-600 font-medium">
                Know More →
              </Link>
            </CardHeader>

            <CardFooter className="relative h-[280px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Online store"
                fill
                className="object-cover"
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
