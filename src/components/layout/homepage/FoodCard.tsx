import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MenuItem } from "@prisma/client";
import { Star } from "lucide-react";

interface FoodCardProps {
  item: MenuItem;
}

export default function FoodCard({ item }: FoodCardProps) {
  const truncatedDescription = item.description
    ? item.description.split(" ").slice(0, 20).join(" ")
    : "";

  const showSeeMore = item.description
    ? item.description.split(" ").length > 20
    : false;

  return (
    <div className="p-1 flex justify-center">
      <Card className="flex flex-col items-center w-[260px] h-[400px] rounded-t-full rounded-b-xl shadow-lg">
        <CardHeader className="w-full flex flex-col items-center">
          <Image
            src={item.image || "/fallback.jpg"}
            alt={item.name}
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-full"
          />
          <p className="text-center text-xl capitalize mt-2">{item.name}</p>
        </CardHeader>

        <CardContent className="flex flex-col items-center text-center p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 text-green-500">
            <Star className="w-4 h-4 fill-green-500 stroke-none" />
            <span className="font-bold">5.0</span>
            <span className="text-gray-500">(6)</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mt-2 text-sm leading-tight">
            {truncatedDescription}
            {showSeeMore && (
              <span className="text-green-700 cursor-pointer">...see more</span>
            )}
          </p>

          {/* Price */}
          <p className="font-bold text-lg mt-2">
            ₹{item.price ? item.price.toFixed(2) : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
