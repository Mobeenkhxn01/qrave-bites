"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import MenuItemCard from "@/components/menu/MenuItemCard";

export default function Restaurant() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full px-6 md:px-24 flex flex-col items-center shadow-lg rounded-b-lg">
      {/* Restaurant Details */}
      <section className="text-center w-full max-w-4xl my-6">
        <h1 className="text-3xl font-bold mb-2">Restaurant Name</h1>
        <Card className="shadow-lg">
          <CardContent className="p-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
            architecto consectetur illo quidem voluptatibus quasi error
            praesentium ratione vero optio! Harum voluptatibus praesentium ab
            distinctio fugit, soluta illo aperiam? Corrupti.
          </CardContent>
        </Card>
      </section>

      {/* Carousel Section */}
      <Carousel orientation="horizontal" className="w-full max-w-4xl">
        <div className="w-full flex justify-between items-center mb-2">
          <Label className="text-2xl">Deal for you</Label>
          <div className="flex justify-end items-center gap-4">
            <CarouselPrevious className="static" />
            <CarouselNext className="static" />
          </div>
        </div>

        <CarouselContent className="-mt-1 h-[200px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1 basis-full sm:basis-1/2">
              <div className="flex justify-center">
                <Card className="w-3/4 h-16">
                  <CardContent className="flex items-center justify-center">
                    <p>hi</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Menu Section */}
      <div className="w-full flex flex-col items-center mt-8">
        <div className="flex flex-row items-center mb-4">
          <Image
            src="/titleIcon.svg"
            className="w-4 h-4"
            alt="title icon"
            width={512}
            height={512}
          />
          <h1 className="text-[#fc791a] uppercase font-bold text-xl mx-2">
            Menu
          </h1>
          <Image
            src="/titleIcon.svg"
            className="w-4 h-4"
            alt="title icon"
            width={512}
            height={512}
          />
        </div>

        {/* Search Bar + Switch */}
        <div className="w-full max-w-2xl space-y-4">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              id="search"
              placeholder="Search for dishes, restaurants, etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center space-x-3">
            <Switch id="veg" />
            <Label htmlFor="veg">Veg Only</Label>
          </div>
        </div>
        <MenuItemCard/>
      </div>
    </div>
  );
}
