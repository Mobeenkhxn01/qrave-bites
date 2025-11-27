"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Utensils, Sparkles, Store, Star } from "lucide-react";

export default function PartnerWithUs() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#eb0029]" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold font-serif">
          Partner with QraveBites
        </h1>
        <p className="text-muted-foreground text-lg">
          Join India’s smartest QR-based ordering platform and take your
          restaurant business to the next level.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition bg-white text-center">
          <Utensils className="h-10 w-10 mx-auto mb-3 text-[#eb0029]" />
          <h2 className="text-xl font-semibold mb-1">Digital Menu</h2>
          <p className="text-gray-600 text-sm">
            Instantly create and manage your modern digital menu.
          </p>
        </div>

        <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition bg-white text-center">
          <Store className="h-10 w-10 mx-auto mb-3 text-[#eb0029]" />
          <h2 className="text-xl font-semibold mb-1">Easy Setup</h2>
          <p className="text-gray-600 text-sm">
            Register your restaurant and start accepting QR orders in minutes.
          </p>
        </div>

        <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition bg-white text-center">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-[#eb0029]" />
          <h2 className="text-xl font-semibold mb-1">Increase Efficiency</h2>
          <p className="text-gray-600 text-sm">
            Faster ordering, reduced wait time, and higher customer satisfaction.
          </p>
        </div>

        <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition bg-white text-center">
          <Star className="h-10 w-10 mx-auto mb-3 text-[#eb0029]" />
          <h2 className="text-xl font-semibold mb-1">Boost Your Sales</h2>
          <p className="text-gray-600 text-sm">
            More orders, better visibility, and seamless operations.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-14">
        <Link href="/partner-with-us/new">
          <Button
            size="lg"
            className="rounded-full px-10 text-white bg-[#eb0029] hover:bg-[#c40022] text-lg font-semibold shadow-md"
          >
            Register Your Restaurant
          </Button>
        </Link>
      </div>
    </div>
  );
}
