// /app/city/[city]/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RestaurantPage({
  params,
}: {
  params: { city: string; slug: string };
}) {
  const restaurant = await prisma.restaurantStep1.findUnique({
    where: { slug: params.slug },
  });

  if (!restaurant || restaurant.city !== decodeURIComponent(params.city)) {
    return <p>Restaurant not found or city mismatch</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-4">
      <h1 className="text-4xl font-bold">{restaurant.restaurantName}</h1>
      <p>{restaurant.area}, {restaurant.city}</p>

      <Link
        className="text-blue-600 underline"
        href={`/city/${params.city}/${params.slug}/menu-items`}
      >
        View Menu Items
      </Link>
    </div>
  );
}
