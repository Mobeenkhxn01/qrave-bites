"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PartnerWithUs() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#eb0029]" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-6">
        <h1 className="text-4xl font-bold font-serif">Partner with QraveBites</h1>
        <p className="text-muted-foreground text-lg">
          Join our platform and grow your restaurant business effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-5xl mx-auto my-10">
        {/* Add benefit cards here if needed */}
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/partner-with-us/new">
          <Button
            size="lg"
            className="rounded-full px-8 text-white bg-[#eb0029] hover:bg-[#c40022] font-semibold text-lg"
          >
            Register Your Restaurant
          </Button>
        </Link>
      </div>
    </div>
  );
}
