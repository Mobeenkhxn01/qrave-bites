"use client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@prisma/client";
import FoodCarousel from "./FoodCarousel";

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
          {isLoading && <p className="text-center">Loading...</p>}
          {isError && (
            <p className="text-center text-red-500">
              Failed to load menu items.
            </p>
          )}
          {!isLoading && !isError && data.length > 0 ? (
            <FoodCarousel data={data} />
          ) : (
            !isLoading && <p className="text-gray-500">No popular items available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
