import MenuItemCard from "@/components/menu/MenuItemCard";
import { prisma } from "@/lib/prisma";

export default async function MenuItemsPage({
  params,
}: {
  params: { city: string; slug: string };
}) {
  const restaurant = await prisma.restaurantStep1.findUnique({
    where: { slug: params.slug },
  });

  if (!restaurant) return <p>Restaurant not found</p>;

  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id }, // Adjust field if needed
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">
        Menu for {restaurant.restaurantName}
        <MenuItemCard />
      </h1>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            🍽️ {item.name} - ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
