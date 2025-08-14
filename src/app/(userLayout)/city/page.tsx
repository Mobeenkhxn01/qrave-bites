// /app/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const cities = await prisma.restaurantStep1.findMany({
    distinct: ["city"],
    select: { city: true },
  });

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Available Cities</h1>
      <ul className="space-y-4">
        {cities.map((item, i) => (
          <li key={i}>
            <Link
              href={`/city/${encodeURIComponent(item.city)}`}
              className="text-blue-600 hover:underline"
            >
              {item.city}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
