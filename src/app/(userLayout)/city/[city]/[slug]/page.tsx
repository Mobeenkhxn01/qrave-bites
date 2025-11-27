import { prisma } from "@/lib/prisma";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { notFound } from "next/navigation";
import ToastClient from "./toast-client"; // 🔥 client-only wrapper

export const revalidate = 60;

export default async function RestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string; slug: string }>;
  searchParams: { table?: string };
}) {
  const resolved = await params;

  const city = decodeURIComponent(resolved.city);
  const slug = decodeURIComponent(resolved.slug);

  let tableNumber: number | null = null;

  if (searchParams.table) {
    const num = Number(searchParams.table);
    tableNumber = isNaN(num) ? null : num;
  }

  const restaurant = await prisma.restaurantStep1.findUnique({
    where: { slug },
  });

  if (!restaurant) {
    return notFound();
  }

  if (decodeURIComponent(restaurant.city) !== city) {
    return notFound();
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id },
  });

  const hasMenu = menuItems.length > 0;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">

      <div>
        <h1 className="text-4xl font-bold">{restaurant.restaurantName}</h1>
        <p className="text-gray-600">
          {restaurant.area}, {restaurant.city}
        </p>

        {tableNumber !== null && (
          <p className="mt-2 text-green-600 font-semibold">
            Ordering for Table #{tableNumber}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>

        {!hasMenu ? (
          <p className="text-gray-500">No menu items available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                tableNumber={tableNumber}
              />
            ))}
          </div>
        )}
      </div>

      <ToastClient
        restaurantMissing={!restaurant}
        menuMissing={!hasMenu}
        tableInvalid={searchParams.table ? tableNumber === null : false}
      />
    </div>
  );
}
