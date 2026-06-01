"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/lib/api";
import CartDialog from "@/app/(userLayout)/cart/CartDialog";
import { AddToCartButton } from "@/components/menu/AddToCartButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock3, MapPin, Search, Star, ChefHat } from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  available: boolean;
  prepTime: number;
  category: {
    id: string;
    name: string;
  } | null;
  isVeg?: boolean;
};

type MenuResponse = {
  restaurant: {
    id: string;
    restaurantName: string;
    city: string;
    area: string;
    address: string | null;
    rating?: number;
    deliveryTime?: number;
    deliveryFee?: number;
    cuisines?: string[];
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
        params: {
          city,
          slug,
          tableId: tableId ?? undefined,
        },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

const groupedMenu = useMemo(() => {
    const filtered = (data?.menuItems ?? []).filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    const groups = new Map<string, MenuItem[]>();
    filtered.forEach((item) => {
      const category = item.category?.name || "Recommended";
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)?.push(item);
    });

    return Array.from(groups.entries());
  }, [data?.menuItems, search]);
useMemo(() => {
    if (groupedMenu.length > 0 && !activeCategory) {
      setActiveCategory(groupedMenu[0][0]);
    }
  }, [groupedMenu, activeCategory]);

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const section = categoryRefs.current[category];
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="h-32 bg-gray-100 animate-pulse rounded-3xl" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }
if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <ChefHat className="h-14 w-14 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900">
            Unable to load menu
          </h2>
          <p className="text-gray-500 mt-2">
            {typeof error === "object" &&
            error &&
            "message" in error
              ? String(error.message)
              : "Please try again later"}
          </p>
        </div>
      </div>
    );
  }
return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="pt-4 pb-2 text-sm text-gray-600 flex items-center gap-2">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span>/</span>
          <a href={`/city/${city}`} className="hover:text-gray-900">{city}</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{data.restaurant.restaurantName}</span>
        </div>

        {/* Restaurant Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {data.restaurant.restaurantName}
        </h1>

        {/* Main Restaurant Info Card */}
        <div className="bg-white rounded-3xl p-6 mb-6 border border-gray-100 shadow-sm">
          <div className="space-y-4">
            {/* Rating and Price */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full font-semibold">
                <Star className="h-4 w-4 fill-current" />
                {data.restaurant.rating ?? 4.4} ({Math.round(Math.random() * 5000) + 1000}K+ ratings)
              </div>
              <span className="text-gray-900 font-semibold">₹{data.restaurant.deliveryFee ?? 400} for two</span>
            </div>

            {/* Cuisines Tags */}
            <div className="flex flex-wrap gap-2">
              {data.restaurant.cuisines?.map((cuisine, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  {cuisine}{idx < (data.restaurant.cuisines?.length ?? 1) - 1 ? ',' : ''}
                </a>
              )) || <span className="text-orange-600 font-medium">Pizzas, Italian</span>}
            </div>

            {/* Location and Delivery Time */}
            <div className="flex items-start gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Outlet</p>
                  <p className="text-xs text-gray-500">{data.restaurant.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{data.restaurant.deliveryTime ?? 25}-30 mins</p>
                  <p className="text-xs text-gray-500">Delivery time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="sticky top-16 z-50 bg-[#f8f8f8] py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for dishes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>
            {data.tableNumber && (
              <Badge className="bg-orange-600 hover:bg-orange-700 px-3 py-2 h-10 flex items-center">
                Table {data.tableNumber}
              </Badge>
            )}
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="sticky top-32 z-40 bg-[#f8f8f8] py-3">
          <div className="overflow-x-auto whitespace-nowrap flex gap-3 pb-2">
            {groupedMenu.map(([category]) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`px-4 py-2 rounded-full border text-sm transition font-medium shrink-0 ${
                  activeCategory === category
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Sections */}
        <div className="mt-6 pb-32">
          {groupedMenu.map(
            ([category, items]) => (
              <section
                key={category}
                ref={(el) => {
                  if (el) {
                    categoryRefs.current[category] = el;
                  }
                }}
                className="mb-10"
              >
                {/* Category Header */}
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {items.length} items
                  </p>
                </div>

                {/* Items Container */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex justify-between gap-4 p-5 ${
                      index !==
                      items.length - 1
                        ? "border-b"
                        : ""
                    }`}
                  >
                    {/* LEFT SIDE */}

                    <div className="flex-1">

                      {/* Veg Indicator */}

                      <div
                        className={`w-4 h-4 border flex items-center justify-center mb-2 ${
                          item.isVeg
                            ? "border-green-600"
                            : "border-red-600"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        />
                      </div>

                      {/* Name */}

                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.name}
                      </h3>

                      {/* Price */}

                      <p className="font-semibold mt-1 text-gray-900">
                        ₹
                        {item.price.toFixed(
                          2
                        )}
                      </p>

                      {/* Prep Time */}

                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">

                        <Clock3 className="h-3 w-3" />

                        {item.prepTime}
                        mins
                      </div>

                      {/* Description */}

                      {item.description && (
                        <p className="text-sm text-gray-500 mt-3 line-clamp-3 max-w-xl">
                          {
                            item.description
                          }
                        </p>
                      )}

                      {/* Out Of Stock */}

                      {!item.available && (
                        <div className="mt-3">

                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-700"
                          >
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="w-32 shrink-0">

                      <div className="relative">

                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={130}
                          height={130}
                          className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                        />

                        {!item.available && (
                          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Add Button */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                          <AddToCartButton
                            menuItemId={item.id}
                            tableId={tableId}
                            available={item.available}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </section>
            )
          )}
        </div>

        {/* Cart Dialog */}
        <CartDialog tableId={tableId} restaurantId={data.restaurant.id} />
      </div>
    </div>
  );
}
