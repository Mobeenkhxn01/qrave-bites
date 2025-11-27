"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import InventoryForm from "./InventoryForm";
import { PlusIcon } from "lucide-react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shadcn-components/app-sidebar";
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  supplier?: string;
  lastRestocked: string;
};

export default function InventoryPageClient() {
  const queryClient = useQueryClient();

  const [q, setQ] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", q],
    queryFn: async () => {
      const res = await axios.get("/api/inventory", { params: q ? { q } : {} });
      return res.data.items as InventoryItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.post("/api/inventory", payload);
      return res.data.item;
    },
    onSuccess: () => {
      toast.success("Item created");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setOpenForm(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: any) => {
      const res = await axios.put(`/api/inventory/${id}`, payload);
      return res.data.item;
    },
    onSuccess: () => {
      toast.success("Item updated");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setEditItem(null);
      setOpenForm(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/inventory/${id}`);
    },
    onSuccess: () => {
      toast.success("Item deleted");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Delete failed"),
  });

  const handleAdd = () => {
    setEditItem(null);
    setOpenForm(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setOpenForm(true);
  };

  const handleCreateOrUpdate = (values: any) => {
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <DashboardHeader />
        <Toaster />

        {/* Page Wrapper should be inside SidebarInset */}
        <div className="p-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <Input
                placeholder="Search name or supplier..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <Button onClick={handleAdd} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.length ? (
                data.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {item.name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {item.category}
                        </div>
                      </div>
                      <Badge
                        className={
                          item.currentStock === 0
                            ? "text-red-600 bg-red-50"
                            : item.currentStock <= item.minStock
                            ? "text-orange-600 bg-orange-50"
                            : "text-green-600 bg-green-50"
                        }
                      >
                        {item.currentStock === 0
                          ? "Out"
                          : item.currentStock <= item.minStock
                          ? "Low"
                          : "In stock"}
                      </Badge>
                    </CardHeader>

                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Current</span>
                          <span>
                            {item.currentStock} {item.unit}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Min</span>
                          <span>
                            {item.minStock} {item.unit}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Max</span>
                          <span>
                            {item.maxStock} {item.unit}
                          </span>
                        </div>

                        <Progress
                          value={Math.min(
                            (item.currentStock / Math.max(1, item.maxStock)) *
                              100,
                            100
                          )}
                          className="mt-2"
                        />
                      </div>

                      <div className="text-sm">
                        <div>
                          <strong>Cost:</strong> ${item.cost}
                        </div>
                        <div>
                          <strong>Supplier:</strong> {item.supplier || "N/A"}
                        </div>
                        <div>
                          <strong>Last restocked:</strong>{" "}
                          {new Date(item.lastRestocked).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => {
                            if (!confirm("Delete this item?")) return;
                            deleteMutation.mutate(item.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  No inventory items found
                </div>
              )}
            </div>
          )}

          {openForm && (
            <InventoryForm
              initialData={editItem}
              onClose={() => {
                setOpenForm(false);
                setEditItem(null);
              }}
              onSave={handleCreateOrUpdate}
            />
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
