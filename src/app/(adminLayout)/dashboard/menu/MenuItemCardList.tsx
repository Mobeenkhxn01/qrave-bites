import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditIcon, TrashIcon } from "lucide-react";
import { MenuItem } from "./MenuPage";
import Image from "next/image";

export default function MenuItemCardList({
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
      <CardContent className="flex gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-lg">
          <Image
            src={item.image || "/placeholder.svg"}
            width={80}
            height={80}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.category?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">${item.price.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {item.prepTime} min
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {item.isPopular && (
                <Badge
                  variant="secondary"
                  className="bg-orange-500 text-white text-xs"
                >
                  Popular
                </Badge>
              )}
              {item.isNew && (
                <Badge
                  variant="secondary"
                  className="bg-green-500 text-white text-xs"
                >
                  New
                </Badge>
              )}
              <Badge
                variant={item.available ? "default" : "secondary"}
                className="text-xs"
              >
                {item.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={item.available ? "destructive" : "default"}
                size="sm"
                onClick={() => onToggle(item.id)}
              >
                {item.available ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
