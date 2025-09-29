"use client";

import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditMenuForm from "./EditMenuForm"; 
import { Trash } from "lucide-react";

export default function MenuItemsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<any>(null);

  /** Fetch menu items */
  const { data: items = [], isLoading } = useQuery({
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

  /** Delete mutation */
  const deleteMenuItem = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/menu-items`, { params: { id } });
    },
    onSuccess: () => {
      toast.success("Menu item deleted!");
      queryClient.invalidateQueries({ queryKey: ["menu-items", session?.user?.id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Error deleting menu item");
    },
  });

  if (isLoading) {
    return (
      <section className="py-8 bg-white text-center">
        <UserTabs />
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <UserTabs />
      <div className="flex flex-col items-center">
        <div className="w-1/2 flex items-center justify-center mt-8 text-center border border-gray-300 p-2 rounded-lg">
          <Link className="flex flex-row gap-2" href="/menu-items/new">
            <span>Create new menu item</span>
            <Right />
          </Link>
        </div>

        <div className="w-1/2 mt-8">
          <h2 className="text-sm text-gray-500">Edit menu item:</h2>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="bg-gray-200 rounded-lg p-4 flex flex-col items-center"
              >
                <Image
                  className="rounded-md"
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                />
                <div className="text-center mt-2 font-medium">{item.name}</div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="secondary" onClick={() => setEditItem(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => deleteMenuItem.mutate(item.id)}
                    disabled={deleteMenuItem.status === "pending"}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editItem && <EditMenuForm item={editItem} onClose={() => setEditItem(null)} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
