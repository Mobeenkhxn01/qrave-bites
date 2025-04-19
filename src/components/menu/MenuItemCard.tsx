"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Image from "next/image";
import Plus from "../icons/Plus";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function MenuItemCard() {
  const { data, error, isLoading, isError, isFetching } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const res = await fetch("/api/menu-items");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return res.json();
    },
  });

  if (isFetching) return <div>Fetching...</div>;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error.message}
      </div>
    );

  if (!data?.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No menu items available</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center w-full gap-4 py-6">
      {data.map((item: any) => (
        <Card
          key={item.id}
          className="w-full max-w-3xl flex items-start flex-row border-0 border-b-2 rounded-none shadow-none px-4 py-2"
        >
          {/* Left Image */}
          <div className="h-32 w-32 relative mr-4 shrink-0">
            <Image
              priority
              className="rounded object-cover h-32 w-32"
              src={item.image}
              alt={item.name}
              width={512}
              height={512}
            />
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-between flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="uppercase text-lg">{item.name}</CardTitle>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="flex items-center gap-1 text-green-500 mb-2">
                <Star className="w-4 h-4 fill-green-500 stroke-none" />
                <span className="font-bold">5.0</span>
                <span className="text-gray-500 text-sm">(6)</span>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                {item.description.split(" ").slice(0, 20).join(" ")}
                {item.description.split(" ").length > 20 && (
                  <span className="text-green-700 cursor-pointer ml-1">
                    ...see more
                  </span>
                )}
              </div>

              <p className="font-bold text-md">₹{item.price.toFixed(2)}</p>
            </CardContent>

            <CardFooter className="pt-2">
              <Button>
                Add <Plus className="ml-2" />
              </Button>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}
