"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import {MenuItemCard} from "@/components/menu/MenuItemCard";

type Restaurant = {
  id: string;
  restaurantName: string;
  slug: string;
  city: string;
  area: string;
};

export default function Restaurant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("/api/restaurants"); // 👈 API route to fetch restaurant list
      const data = await res.json();
      setRestaurants(data.restaurants || []);
      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="w-full px-6 md:px-24 flex flex-col items-center shadow-lg rounded-b-lg">
      <section className="w-full max-w-5xl mt-10 mb-6">
        <h2 className="text-2xl font-bold mb-4">Explore Restaurants</h2>

        {/* Search Input */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants
              .filter((r) =>
                r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((r) => (
                <Link href={`/restaurant/${r.slug}`} key={r.id}>
                  <Card className="cursor-pointer hover:shadow-lg transition">
                    <CardContent className="p-4 space-y-1">
                      <h3 className="text-lg font-semibold">{r.restaurantName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {r.area}, {r.city}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        )}
      </section>

      {/* Rest of your carousel and menu code */}
      {/* You can keep the rest of your code below if needed */}
    </div>
  );
}
