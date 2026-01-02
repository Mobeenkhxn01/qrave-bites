"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHatIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

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

/* ================= PAGE ================= */

export default function KitchenPage() {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery<KitchenOrder[]>({
    queryKey: ["kitchenOrders"],
    queryFn: async () => {
      const res = await axios.get("/api/kitchen/orders");
      return res.data.orders ?? [];
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: KitchenOrder["status"];
    }) => {
      const res = await axios.put(`/api/kitchen/orders/${id}`, { status });
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
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "preparing" | "ready";
    }) => {
      const res = await axios.put(`/api/kitchen/items/${id}`, { status });
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

  const newOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED"
  );
  const preparingOrders = orders.filter((o) => o.status === "IN_PROGRESS");
  const readyOrders = orders.filter((o) => o.status === "COMPLETED");

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ChefHatIcon className="h-8 w-8" />
            Kitchen Display System
          </h2>
          <p className="text-muted-foreground">
            Active orders: {orders.length}
          </p>
        </div>

        <Card className="p-3">
          <div className="text-sm text-muted-foreground">Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <OrderColumn
          title="New"
          orders={newOrders}
          badge={newOrders.length}
          getStatusColor={getStatusColor}
          onUpdateOrderStatus={updateOrderStatusMutation.mutate}
          onUpdateItemStatus={updateItemStatusMutation.mutate}
        />

        <OrderColumn
          title="Preparing"
          orders={preparingOrders}
          badge={preparingOrders.length}
          getStatusColor={getStatusColor}
          onUpdateOrderStatus={updateOrderStatusMutation.mutate}
          onUpdateItemStatus={updateItemStatusMutation.mutate}
        />

        <OrderColumn
          title="Ready"
          orders={readyOrders}
          badge={readyOrders.length}
          getStatusColor={getStatusColor}
          onUpdateOrderStatus={updateOrderStatusMutation.mutate}
          onUpdateItemStatus={updateItemStatusMutation.mutate}
        />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function OrderColumn({
  title,
  orders,
  badge,
  getStatusColor,
  onUpdateOrderStatus,
  onUpdateItemStatus,
}: {
  title: string;
  orders: KitchenOrder[];
  badge: number;
  getStatusColor: (s: KitchenOrder["status"]) => string;
  onUpdateOrderStatus: (p: {
    id: string;
    status: KitchenOrder["status"];
  }) => void;
  onUpdateItemStatus: (p: {
    id: string;
    status: "pending" | "preparing" | "ready";
  }) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge>{badge}</Badge>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <KitchenOrderCard
            key={order.id}
            order={order}
            getStatusColor={getStatusColor}
            onUpdateOrderStatus={(status) =>
              onUpdateOrderStatus({ id: order.id, status })
            }
            onUpdateItemStatus={(id, status) =>
              onUpdateItemStatus({ id, status })
            }
          />
        ))}
      </div>
    </div>
  );
}

function KitchenOrderCard({
  order,
  onUpdateOrderStatus,
  onUpdateItemStatus,
  getStatusColor,
}: {
  order: KitchenOrder;
  onUpdateOrderStatus: (status: KitchenOrder["status"]) => void;
  onUpdateItemStatus: (
    itemId: string,
    status: "pending" | "preparing" | "ready"
  ) => void;
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
            <div className="font-medium">
              {item.quantity}× {item.menuItem?.name ?? "Item"}
            </div>

            <div className="flex gap-1">
              <Button
                size="sm"
                variant={item.status === "preparing" ? "default" : "outline"}
                onClick={() => onUpdateItemStatus(item.id, "preparing")}
              >
                Prep
              </Button>
              <Button
                size="sm"
                variant={item.status === "ready" ? "default" : "outline"}
                onClick={() => onUpdateItemStatus(item.id, "ready")}
              >
                Ready
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {order.status === "PENDING" && (
          <Button onClick={() => onUpdateOrderStatus("IN_PROGRESS")}>
            Start Preparing
          </Button>
        )}
        {order.status === "IN_PROGRESS" && (
          <Button onClick={() => onUpdateOrderStatus("COMPLETED")}>
            Mark Ready
          </Button>
        )}
      </div>
    </Card>
  );
}
