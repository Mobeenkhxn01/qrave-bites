"use client";
import Image from "next/image";
import * as React from "react";

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

export default function PopularFood() {
  return (
    <div className="w-full flex justify-center items-center flex-col mt-4 pt-10">
      <div className="w-full max-w-6xl flex justify-center items-center flex-col">
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

        <div className="w-full flex justify-center items-center mt-4">
          <h1 className="text-[#010f1c] font-extrabold text-3xl">
            Popular Food Items
          </h1>
        </div>

        <div className="w-full flex justify-center items-center mt-6">
          <Carousel
          opts={{loop: true}}
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 10 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div className="w-full flex justify-center items-center my-10 gap-4">
        
          <Card  className="relative w-1/3 rounded-none">
            <div className="relative w-full h-64">
              <Image
                src="/banner3.jpg"
                alt={`weekly offer `}
                className="object-cover"
                fill
              />
              {/* Overlay content */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-4">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    Weekly Offer 
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white text-center mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit
                  tempora libero non id, eos maxime, eaque placeat nemo deleniti.
                </CardContent>
                <CardFooter className="mt-4">
                  <button className="bg-[#fc791a] text-white px-4 py-2">
                    Order Now
                  </button>
                </CardFooter>
              </div>
            </div>
          </Card>
          <Card  className="relative w-1/3 rounded-none">
            <div className="relative w-full h-64">
              <Image
                src="/banner3.jpg"
                alt={`weekly offer `}
                className="object-cover"
                fill
              />
              {/* Overlay content */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-4">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    15 Days Offer 
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white text-center mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit
                  tempora libero non id, eos maxime, eaque placeat nemo deleniti.
                </CardContent>
                <CardFooter className="mt-4">
                  <button className="bg-[#fc791a] text-white px-4 py-2">
                    Order Now
                  </button>
                </CardFooter>
              </div>
            </div>
          </Card>
          <Card  className="relative w-1/3 rounded-none">
            <div className="relative w-full h-64">
              <Image
                src="/banner3.jpg"
                alt={`weekly offer `}
                className="object-cover"
                fill
              />
              {/* Overlay content */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-4">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    Monthly Offer 
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white text-center mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit
                  tempora libero non id, eos maxime, eaque placeat nemo deleniti.
                </CardContent>
                <CardFooter className="mt-4">
                  <button className="bg-[#fc791a] text-white px-4 py-2 ">
                    Order Now
                  </button>
                </CardFooter>
              </div>
            </div>
          </Card>
        
      </div>
    </div>
  );
}
