"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddMenuItemForm from "./AddMenuItemForm";
import AddCategoryItem from "./AddCategoryItem";
import MenuItemCard from "./MenuItemCard";
import MenuItemCardList from "./MenuItemCardList";
import { PlusIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
  prepTime: number;
  isPopular?: boolean;
  isNew?: boolean;
  allergens?: string[];
  category?: { id: string; name: string };
}

export default function MenuPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await axios.get("/api/categories", {
        params: { userId: session.user.id },
      });
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading: isMenuLoading } = useQuery<
    MenuItem[]
  >({
    queryKey: ["menu-items", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await axios.get("/api/menu-items", {
        params: { userId: session.user.id },
      });
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getItemsByCategory = (category: { name: string }) =>
    menuItems.filter((item) => item.category?.name === category.name);

  const toggleAvailability = async (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) return;

    await axios.put("/api/menu-items", { ...item, available: !item.available });

    if (session?.user?.id) {
      queryClient.invalidateQueries({
        queryKey: ["menu-items", session.user.id],
      });
    }
  };

  const deleteItem = async (id: string) => {
    await axios.delete(`/api/menu-items?id=${id}`);
    if (session?.user?.id) {
      queryClient.invalidateQueries({
        queryKey: ["menu-items", session.user.id],
      });
    }
  };

  if (isMenuLoading || isCategoriesLoading)
    return <div className="p-4 text-center">Loading...</div>;

  return (

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header + Buttons */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Menu Management
              </h2>
              <p className="text-muted-foreground">
                Manage your restaurant menu items and categories
              </p>
            </div>

            <div className="flex gap-2">
              <Dialog
                open={isAddCategoryOpen}
                onOpenChange={setIsAddCategoryOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-162.5">
                  <DialogHeader>
                    <DialogTitle>Add New Category Item</DialogTitle>
                    <DialogDescription>
                      Create a new category for Food
                    </DialogDescription>
                  </DialogHeader>
                  <AddCategoryItem
                    onClose={() => setIsAddCategoryOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog
                open={isAddMenuItemOpen}
                onOpenChange={setIsAddMenuItemOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-162.5">
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                    <DialogDescription>
                      Fill in all details below
                    </DialogDescription>
                  </DialogHeader>
                  <AddMenuItemForm
                    onClose={() => setIsAddMenuItemOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem
                    key={category.id}
                    value={category.name}
                    className="capitalize"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="categories">By Category</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onToggle={toggleAvailability}
                    onDelete={deleteItem}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {filteredItems.map((item) => (
                <MenuItemCardList
                  key={item.id}
                  item={item}
                  onToggle={toggleAvailability}
                  onDelete={deleteItem}
                />
              ))}
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              {categories.map((category: any) => (
                <div key={category.id} className="space-y-4">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getItemsByCategory(category).map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onToggle={toggleAvailability}
                        onDelete={deleteItem}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
  );
}
