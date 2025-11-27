"use client";

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { PlusIcon, ClockIcon, ChefHatIcon } from "lucide-react";
import { AppSidebar } from "@/components/shadcn-components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header";
import { cn } from "@/lib/utils";
import Pusher from "pusher-js";

type OrderItemDTO = {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  status?: "pending" | "preparing" | "ready";
  menuItem?: {
    id: string;
    name: string;
  } | null;
};

type KitchenOrder = {
  id: string;
  orderNumber: number;
  tableNumber: number | null;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  paid: boolean;
  totalAmount: number;
  createdAt: string;
  items: OrderItemDTO[];
};

export default function KitchenPage() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<KitchenOrder[]>({
    queryKey: ["kitchenOrders"],
    queryFn: async () => {
      const res = await axios.get("/api/kitchen/orders");
      return res.data.orders as KitchenOrder[];
    },
    refetchInterval: false,
  });

  useEffect(() => {
    const pusherKey: string = process.env.NEXT_PUBLIC_PUSHER_KEY ?? "";
    const pusherCluster: string = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "";

    if (!pusherKey || !pusherCluster) {
      console.error("Pusher client env variables missing.");
    }
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    // subscribe to a generic channel - server triggers `restaurant-{restaurantId}` events
    // we'll listen on channel provided by server in event payload (server also triggers restaurant-specific channels)
    const channel = pusher.subscribe("kitchen-global");
    channel.bind("orders-updated", (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ["kitchenOrders"] });
    });

    // also subscribe to restaurant-specific channel if server returns restaurantId in a bootstrap call
    // fallback: server triggers kitchen-global for fallback

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [queryClient]);

  const updateOrderStatusMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      status: KitchenOrder["status"];
    }) => {
      const res = await axios.put(`/api/kitchen/orders/${payload.id}`, {
        status: payload.status,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["kitchenOrders"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update order");
    },
  });

  const updateItemStatusMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      status: "pending" | "preparing" | "ready";
    }) => {
      const res = await axios.put(`/api/kitchen/items/${payload.id}`, {
        status: payload.status,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Item status updated");
      queryClient.invalidateQueries({ queryKey: ["kitchenOrders"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update item");
    },
  });

  function getPriorityColor(priority: "low" | "medium" | "high") {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-200 text-red-800";
      case "medium":
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
      default:
        return "bg-green-100 border-green-200 text-green-800";
    }
  }

  function getStatusColor(status: KitchenOrder["status"]) {
    switch (status) {
      case "PENDING":
        return "border-blue-500 bg-blue-50";
      case "IN_PROGRESS":
        return "border-orange-500 bg-orange-50";
      case "COMPLETED":
        return "border-green-500 bg-green-50";
      case "CANCELLED":
        return "border-red-300 bg-red-50";
      case "CONFIRMED":
        return "border-indigo-200 bg-indigo-50";
      default:
        return "border-gray-300 bg-white";
    }
  }

  const newOrders = (orders || []).filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED"
  );
  const preparingOrders = (orders || []).filter(
    (o) => o.status === "IN_PROGRESS"
  );
  const readyOrders = (orders || []).filter((o) => o.status === "COMPLETED");

  return (
    <div className="flex flex-col">
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
          <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <ChefHatIcon className="h-8 w-8" />
                  Kitchen Display System
                </h2>
                <p className="text-muted-foreground">
                  Active orders: {orders?.length ?? 0}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Card className="p-3">
                  <div className="text-sm text-muted-foreground">Orders</div>
                  <div className="text-2xl font-bold">
                    {orders?.length ?? 0}
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">New</h3>
                  <Badge>{newOrders.length}</Badge>
                </div>
                <div className="space-y-4">
                  {newOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onUpdateOrderStatus={(s) =>
                        updateOrderStatusMutation.mutate({
                          id: order.id,
                          status: s,
                        })
                      }
                      onUpdateItemStatus={(itemId, s) =>
                        updateItemStatusMutation.mutate({
                          id: itemId,
                          status: s,
                        })
                      }
                      getPriorityColor={() => ""}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Preparing</h3>
                  <Badge>{preparingOrders.length}</Badge>
                </div>
                <div className="space-y-4">
                  {preparingOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onUpdateOrderStatus={(s) =>
                        updateOrderStatusMutation.mutate({
                          id: order.id,
                          status: s,
                        })
                      }
                      onUpdateItemStatus={(itemId, s) =>
                        updateItemStatusMutation.mutate({
                          id: itemId,
                          status: s,
                        })
                      }
                      getPriorityColor={() => ""}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Ready</h3>
                  <Badge>{readyOrders.length}</Badge>
                </div>
                <div className="space-y-4">
                  {readyOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onUpdateOrderStatus={(s) =>
                        updateOrderStatusMutation.mutate({
                          id: order.id,
                          status: s,
                        })
                      }
                      onUpdateItemStatus={(itemId, s) =>
                        updateItemStatusMutation.mutate({
                          id: itemId,
                          status: s,
                        })
                      }
                      getPriorityColor={() => ""}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function KitchenOrderCard({
  order,
  onUpdateOrderStatus,
  onUpdateItemStatus,
  getPriorityColor,
  getStatusColor,
}: {
  order: KitchenOrder;
  onUpdateOrderStatus: (status: KitchenOrder["status"]) => void;
  onUpdateItemStatus: (
    itemId: string,
    status: "pending" | "preparing" | "ready"
  ) => void;
  getPriorityColor: (p: "low" | "medium" | "high") => string;
  getStatusColor: (s: KitchenOrder["status"]) => string;
}) {
  return (
    <Card className={cn("p-4", getStatusColor(order.status))}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">Order #{order.orderNumber}</div>
          <div className="text-sm text-muted-foreground">
            Table {order.tableNumber ?? "—"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm">₹{order.totalAmount.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 bg-white rounded border"
          >
            <div className="flex-1">
              <div className="font-medium">
                {item.quantity}× {item.menuItem?.name ?? "Item"}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={item.status === "preparing" ? "default" : "outline"}
                onClick={() => onUpdateItemStatus(item.id, "preparing")}
                className="text-xs px-2 py-1"
              >
                Prep
              </Button>
              <Button
                size="sm"
                variant={item.status === "ready" ? "default" : "outline"}
                onClick={() => onUpdateItemStatus(item.id, "ready")}
                className="text-xs px-2 py-1"
              >
                Ready
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {order.status === "PENDING" && (
          <Button
            size="sm"
            onClick={() => onUpdateOrderStatus("IN_PROGRESS")}
            className="flex-1"
          >
            Start Preparing
          </Button>
        )}
        {order.status === "IN_PROGRESS" && (
          <Button
            size="sm"
            onClick={() => onUpdateOrderStatus("COMPLETED")}
            className="flex-1"
          >
            Mark Ready
          </Button>
        )}
        {order.status === "COMPLETED" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateOrderStatus("COMPLETED")}
            className="flex-1"
          >
            Completed
          </Button>
        )}
      </div>
    </Card>
  );
}
