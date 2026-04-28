"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CartDialog from "@/app/(userLayout)/cart/CartDialog";
import { AddToCartButton } from "@/components/menu/AddToCartButton";
import Image from "next/image";
import { Clock3, MapPin } from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  available: boolean;
  prepTime: number;
  category: { id: string; name: string } | null;
};

type MenuResponse = {
  restaurant: {
    id: string;
    restaurantName: string;
    city: string;
    area: string;
    address: string | null;
  };
  tableNumber: number | null;
  menuItems: MenuItem[];
};

export default function RestaurantMenuClient({
  city,
  slug,
  tableId,
}: {
  city: string;
  slug: string;
  tableId: string | null;
}) {
  const { data, isLoading, isError, error } = useQuery<MenuResponse>({
    queryKey: ["restaurant-menu", city, slug, tableId],
    queryFn: async () => {
      const res = await api.get("/restaurants/menu", {
        params: { city, slug, tableId: tableId ?? undefined },
      });
      return res.data;
    },
  });

  const groupedMenu = useMemo(() => {
    const groups = new Map<string, MenuItem[]>();
    for (const item of data?.menuItems ?? []) {
      const categoryName = item.category?.name || "Chef Specials";
      if (!groups.has(categoryName)) {
        groups.set(categoryName, []);
      }
      groups.get(categoryName)?.push(item);
    }
    return Array.from(groups.entries());
  }, [data?.menuItems]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="h-36 rounded-2xl bg-muted animate-pulse" />
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-72 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Unable to load menu</h1>
        <p className="mt-2 text-muted-foreground">
          {typeof error === "object" &&
          error &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "Please try again in a moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Card className="overflow-hidden border-0 shadow-md bg-white">
          <div className="relative h-48 md:h-56">
            <Image
              src="/bannerBG1_1.jpg"
              alt={data.restaurant.restaurantName}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold">{data.restaurant.restaurantName}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
                <MapPin className="h-4 w-4" />
                {data.restaurant.area}, {data.restaurant.city}
              </p>
              {data.tableNumber !== null && (
                <Badge className="mt-3 bg-[#eb0029] hover:bg-[#eb0029]">
                  Table {data.tableNumber}
                </Badge>
              )}
            </div>
          </div>
        </Card>

        <div className="sticky top-16 z-30 mt-4 bg-[#f5f5f5] py-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {groupedMenu.map(([category]) => (
              <a
                key={category}
                href={`#cat-${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-full border bg-white px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-gray-50"
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-6">
          {groupedMenu.map(([category, items]) => (
            <section
              key={category}
              id={`cat-${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <h2 className="text-xl font-bold">{category}</h2>
              <Separator className="my-3" />

              <div className="space-y-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className={`border shadow-none ${!item.available ? "opacity-70" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold capitalize">{item.name}</h3>
                            {!item.available && (
                              <Badge variant="destructive" className="text-xs">
                                Unavailable
                              </Badge>
                            )}
                          </div>
                          {item.description ? (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          ) : null}
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-bold text-[#eb0029]">
                              ₹{item.price.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {item.prepTime} mins
                            </span>
                          </div>
                        </div>

                        <div className="w-28 md:w-36">
                          <div className="relative h-24 md:h-28 w-full overflow-hidden rounded-lg border">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="mt-2">
                            <AddToCartButton
                              menuItemId={item.id}
                              tableId={tableId}
                              available={item.available}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <CartDialog tableId={tableId} restaurantId={data.restaurant.id} />
    </div>
  );
}
