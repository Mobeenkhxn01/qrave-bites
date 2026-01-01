import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditIcon, TrashIcon } from "lucide-react";
import { MenuItem } from "./MenuPage";
import Image from "next/image";

export default function MenuItemCard({
  item,
  onToggle,
  onDelete,
}: {
  item: MenuItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className={`${!item.available ? "opacity-60" : ""}`}>
      <CardHeader className="p-0 relative">
        <Image
          src={item.image || "/placeholder.svg"}
          width={400}
          height={300}
          alt={item.name}
          className="h-48 w-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isPopular && (
            <Badge variant="secondary" className="bg-orange-500 text-white">
              Popular
            </Badge>
          )}
          {item.isNew && (
            <Badge variant="secondary" className="bg-green-500 text-white">
              New
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={item.available ? "default" : "secondary"}>
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
        </div>
        <CardDescription className="line-clamp-2 mb-3">
          {item.description}
        </CardDescription>
        <div className="flex flex-wrap gap-1">
          {item.allergens?.map((allergen) => (
            <Badge key={allergen} variant="outline" className="text-xs">
              {allergen}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(item.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant={item.available ? "destructive" : "default"}
          size="sm"
          onClick={() => onToggle(item.id)}
        >
          {item.available ? "Disable" : "Enable"}
        </Button>
      </CardFooter>
    </Card>
  );
}
