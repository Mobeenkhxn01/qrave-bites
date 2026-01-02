import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ToastClient from "./toast-client";

export type CityItem = {
  city: string;
};

export default async function HomePage() {
  const cities: CityItem[] = await prisma.restaurantStep1.findMany({
    distinct: ["city"],
    select: { city: true },
    orderBy: { city: "asc" },
  });

  const noCities = cities.length === 0;

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <ToastClient noCities={noCities} />

      <h1 className="text-3xl font-bold mb-6">Available Cities</h1>

      {noCities ? (
        <p className="text-gray-500 text-lg">No cities available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cities.map((item: CityItem, index: number) => (
            <Link
              key={index}
              href={`/city/${encodeURIComponent(item.city)}`}
              className="
                bg-white border rounded-lg p-4 text-center shadow-sm
                hover:shadow-md transition
                text-gray-800 font-medium
              "
            >
              {item.city}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
