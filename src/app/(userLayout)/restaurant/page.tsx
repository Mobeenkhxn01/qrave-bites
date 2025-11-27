"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

type Restaurant = {
  id: string;
  restaurantName: string;
  slug: string;
  city: string;
  area: string;
};

export default function Restaurant() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/restaurants");
        return res.data.restaurants as Restaurant[];
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to load restaurants");
        throw new Error("Failed to fetch restaurants");
      }
    },
    staleTime: 60 * 1000,
  });

  const restaurants = data || [];

  const filtered = restaurants.filter((r) =>
    r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-6 md:px-24 flex flex-col items-center shadow-lg rounded-b-lg pt-10 pb-20">
      <section className="w-full max-w-5xl">
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

        {isLoading ? (
          <p className="text-center py-10 text-gray-500">
            Loading restaurants...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No restaurants found matching “{searchTerm}”
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <Link href={`/restaurant/${r.slug}`} key={r.id}>
                <Card className="cursor-pointer hover:shadow-lg transition">
                  <CardContent className="p-4 space-y-1">
                    <h3 className="text-lg font-semibold">
                      {r.restaurantName}
                    </h3>
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
    </div>
  );
}
