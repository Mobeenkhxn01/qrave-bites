import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ToastClient from "./toast-client";

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const resolved = await params;
  const city = decodeURIComponent(resolved.city);

  const restaurants = await prisma.restaurantStep1.findMany({
    where: { city },
    include: { step2: true },
  });

  const noRestaurants = restaurants.length === 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <ToastClient noRestaurants={noRestaurants} />

      <h1 className="text-3xl font-bold mb-6">
        Restaurants in <span className="text-red-600">{city}</span>
      </h1>

      {noRestaurants ? (
        <p className="text-gray-500 text-lg">No restaurants found in this city.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition rounded-lg overflow-hidden border"
            >
              <Link
                href={`/${resolved.city}/${item.slug}`}
                className="block w-full h-full"
              >
                <CardHeader className="p-0">
                  {item.step2?.restaurantImageUrl ? (
                    <Image
                      src={item.step2.restaurantImageUrl}
                      alt={item.restaurantName}
                      width={500}
                      height={300}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-3">
                  <h2 className="text-lg font-semibold line-clamp-1">
                    {item.restaurantName}
                  </h2>

                  <p className="text-sm text-gray-500 line-clamp-1">
                    {item.area}, {item.city}
                  </p>
                </CardContent>

                <CardFooter className="p-3">
                  <p className="text-red-500 font-semibold text-sm">View Menu →</p>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
