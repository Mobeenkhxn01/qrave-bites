import { prisma } from "@/lib/prisma";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function RestaurantPage({
  params
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const data=await params
  const city = decodeURIComponent(data.city);
  const slug = decodeURIComponent(data.slug);

  const restaurant = await prisma.restaurantStep1.findUnique({
    where: { slug },
  });

  if (!restaurant || decodeURIComponent(restaurant.city) !== city) {
    return notFound();
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-4xl font-bold">{restaurant.restaurantName}</h1>
        <p className="text-gray-600">
          {restaurant.area}, {restaurant.city}
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
