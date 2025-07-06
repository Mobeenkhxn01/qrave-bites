// /app/city/[city]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CityPage({ params }: { params: { city: string } }) {
  const restaurants = await prisma.restaurantStep1.findMany({
    where: {
      city: decodeURIComponent(params.city),
    },
    select: {
      id: true,
      slug: true,
      restaurantName: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Restaurants in {decodeURIComponent(params.city)}
      </h1>
      <ul className="space-y-4">
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <Link
              className="text-blue-600 hover:underline"
              href={`/city/${params.city}/${restaurant.slug}`}
            >
              {restaurant.restaurantName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
