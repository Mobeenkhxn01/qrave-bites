import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { use } from 'react'

// interface Props {
//   params: { city: string };
// }

export default async function CityPage( {
  params,
}: {
  params: Promise<{ city: string}>
} ) {

  const data=use(params)
  const city = decodeURIComponent(data.city);

  const step1 = await prisma.restaurantStep1.findMany({
    where: { city },
    include: {
      RestaurantStep2: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Restaurants in {city}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {step1.map((item) => (
          <Card key={item.id}>
            <Link
              href={`/city/${data.city}/${item.slug}`}
              className="block hover:underline"
            >
              <CardHeader>

                {item.RestaurantStep2?.restaurantImageUrl ? (
                  <Image
                    src={item.RestaurantStep2.restaurantImageUrl}
                    alt="restaurant_image"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[300px] h-[200px] bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </CardHeader>
              <CardContent className="text-lg font-semibold">
                {item.restaurantName}
              </CardContent>
              <CardFooter />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
