"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export interface SelectableItem {
  id: string;
  name: string;
  [key: string]: any;
}

interface SelectableListProps {
  items: SelectableItem[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  maxSelections?: number;
  className?: string;
  label?: string;
  searchPlaceholder?: string;
  maxHeight?: number;
}

export function SelectableList({
  items,
  selectedIds,
  onChange,
  maxSelections = 3,
  className,
  label,
  searchPlaceholder = "Search...",
  maxHeight = 300,
}: SelectableListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  // Filter items based on search term
  useEffect(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      // If already selected, remove it
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      // If not selected and under max limit, add it
      if (selectedIds.length < maxSelections) {
        onChange([...selectedIds, id]);
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Selection limit indicator */}
      <div className="text-sm text-muted-foreground">
        {selectedIds.length} of {maxSelections} selected
      </div>

      {/* Selectable items */}
      <ScrollArea className="h-72 w-full border rounded-md">
        <div className="p-2 grid grid-cols-2 gap-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-3 rounded-md cursor-pointer transition-all",
                    "hover:bg-muted/50",
                    isSelected
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-border"
                  )}
                  onClick={() => handleToggleSelect(item.id)}
                >
                  <div className="font-medium">{item.name}</div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-4 text-muted-foreground">
              No items found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
