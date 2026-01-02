"use client";

import React from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";


type OrderItem = {
  id: string;
  menuItem: { id: string; name: string };
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: number;
  tableNumber?: number | null;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  paid: boolean;
  createdAt: string;
  items: OrderItem[];
};

function friendlyDate(iso?: string) {
  return iso ? new Date(iso).toLocaleString() : "";
}



export default function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const r = await axios.get("/api/orders");
      return r.data ?? [];
    },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Orders</h2>

        <div className="flex gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8 md:w-60 lg:w-85"
            />
          </div>

          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["orders"] })
            }
          >
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            orders.map((o) => <OrderCard key={o.id} order={o} />)
          )}
        </TabsContent>

        <TabsContent value="processing">
          {orders
            .filter(
              (o) =>
                o.status === "PENDING" ||
                o.status === "CONFIRMED" ||
                o.status === "IN_PROGRESS"
            )
            .map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
        </TabsContent>

        <TabsContent value="completed">
          {orders
            .filter((o) => o.status === "COMPLETED")
            .map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
        </TabsContent>

        <TabsContent value="cancelled">
          {orders
            .filter((o) => o.status === "CANCELLED")
            .map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}


function OrderCard({ order }: { order: Order }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { id: string; status: Order["status"] }) => {
      return axios.patch(`/api/orders/${data.id}`, { status: data.status });
    },
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to update order");
    },
  });

  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>
            #{order.orderNumber} • Table {order.tableNumber ?? "—"}
          </CardTitle>
          <CardDescription>{friendlyDate(order.createdAt)}</CardDescription>
        </div>

        <StatusBadge status={order.status} />
      </CardHeader>

      <CardContent>
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm">
            <span>
              {i.quantity}× {i.menuItem.name}
            </span>
            <span>₹{i.price}</span>
          </div>
        ))}

        <div className="mt-4 flex gap-2">
          {getStatusActions(order.status).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === "CANCELLED" ? "destructive" : "default"}
              onClick={() => mutation.mutate({ id: order.id, status: s })}
            >
              {s.replace("_", " ")}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <Badge
      className={cn(
        status === "COMPLETED" && "bg-emerald-500/10 text-emerald-600",
        status === "CANCELLED" && "bg-red-500/10 text-red-600",
        status !== "COMPLETED" &&
          status !== "CANCELLED" &&
          "bg-amber-500/10 text-amber-600"
      )}
    >
      {status}
    </Badge>
  );
}

function getStatusActions(status: Order["status"]): Order["status"][] {
  switch (status) {
    case "PENDING":
      return ["CONFIRMED", "IN_PROGRESS", "CANCELLED"];
    case "CONFIRMED":
      return ["IN_PROGRESS", "CANCELLED"];
    case "IN_PROGRESS":
      return ["COMPLETED", "CANCELLED"];
    case "COMPLETED":
      return ["IN_PROGRESS"];
    case "CANCELLED":
      return ["PENDING"];
    default:
      return [];
  }
}
