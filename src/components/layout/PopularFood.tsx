"use client";
import Image from "next/image";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { MenuItem } from "@prisma/client";
import { Star } from "lucide-react";

export default function PopularFood() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const res = await fetch("/api/menu-items");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return res.json();
    },
  });

  if (isLoading) return <h1 className="text-center">Loading...</h1>;
  if (isError)
    return (
      <h1 className="text-center text-red-500">Failed to load menu items.</h1>
    );

  return (
    <div className="w-full flex flex-col items-center mt-4 pt-10">
      <div className="w-full max-w-6xl flex flex-col items-center">
        {/* Section Title */}
        <div className="flex flex-row items-center">
          <Image
            src="/titleIcon.svg"
            className="w-4 h-4"
            alt="title icon"
            width={512}
            height={512}
          />
          <h1 className="text-[#fc791a] uppercase font-bold text-xl mx-2">
            Best Food
          </h1>
          <Image
            src="/titleIcon.svg"
            className="w-4 h-4"
            alt="title icon"
            width={512}
            height={512}
          />
        </div>

        <h1 className="text-[#010f1c] font-extrabold text-3xl mt-4">
          Popular Food Items
        </h1>

        {/* Carousel */}
        <div className="w-full mt-6">
          {data.length > 0 ? (
            <Carousel
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 2000 })]}
              className="w-full"
            >
              <CarouselContent>
                {data.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1 flex gap-1">
                      <Card className="flex flex-col items-center w-[260px] h-[400px] rounded-t-full rounded-b-xl shadow-lg">
                        <CardHeader className="w-full flex flex-col items-center">
                          <Image
                            src={item.image || "/fallback.jpg"}
                            alt={item.name}
                            width={512}
                            height={512}
                            className="w-32 h-32 object-cover rounded-full"
                          />
                          <p className="text-center text-xl capitalize mt-2">
                            {item.name}
                          </p>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center p-4">
                          <div className="flex items-center gap-1 text-green-500">
                            <Star className="w-4 h-4 fill-green-500 stroke-none" />
                            <span className="font-bold">5.0</span>
                            <span className="text-gray-500">(6)</span>
                          </div>
                          <p className="text-gray-600 mt-2 text-sm leading-tight">
                            {item.description
                              ? item.description
                                  .split(" ")
                                  .slice(0, 20)
                                  .join(" ")
                              : ""}
                            {item.description &&
                              item.description.split(" ").length > 20 && (
                                <span className="text-green-700 cursor-pointer">
                                  ...see more
                                </span>
                              )}
                          </p>
                          <p className="font-bold text-lg mt-2">
                            ₹{item.price ? item.price.toFixed(2) : "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <p className="text-gray-500">No popular items available.</p>
          )}
        </div>
      </div>

      {/* Offers Section */}
      {/* <div className="w-full flex justify-center gap-4 my-10">
        <OfferCard
          title={"Weekly Offer"}
          description="Get exclusive weekly discounts on selected dishes!"
        />
        <OfferCard
          title="15 Days Offer"
          description="Limited-time offers every 15 days. Don't miss out!"
        />
        <OfferCard
          title="Monthly Offer"
          description="Enjoy our monthly specials with great savings!"
        />
      </div> */}
    </div>
  );
}
