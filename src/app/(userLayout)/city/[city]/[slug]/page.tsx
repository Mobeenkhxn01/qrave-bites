import { prisma } from "@/lib/prisma";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function RestaurantPage({
  params,
  searchParams
}: {
  params: Promise<{ city: string; slug: string }>;
  searchParams: { table?: string };
}) {
  // Wait for params (because Next.js now wraps them in a Promise)
  const data = await params;

  const city = decodeURIComponent(data.city);
  const slug = decodeURIComponent(data.slug);

  // 🔥 NEW: Extract table number from search params
  const tableNumber = searchParams.table
    ? Number(searchParams.table)
    : null;

  // Fetch restaurant info
  const restaurant = await prisma.restaurantStep1.findUnique({
    where: { slug },
  });

  if (!restaurant || decodeURIComponent(restaurant.city) !== city) {
    return notFound();
  }

  // Fetch menu items
  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">

      {/* Restaurant Header */}
      <div>
        <h1 className="text-4xl font-bold">{restaurant.restaurantName}</h1>
        <p className="text-gray-600">
          {restaurant.area}, {restaurant.city}
        </p>

        {/* 🔥 Show table info if scanned from QR */}
        {tableNumber !== null && (
          <p className="mt-2 text-green-600 font-semibold">
            Ordering for Table #{tableNumber}
          </p>
        )}
      </div>

      {/* Menu Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              tableNumber={tableNumber}     // 🔥 pass table number here
            />
          ))}
        </div>
      </div>
    </div>
  );
}
