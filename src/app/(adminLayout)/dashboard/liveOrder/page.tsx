"use client";

import React, { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Pusher from "pusher-js";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shadcn-components/app-sidebar";
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  SearchIcon,
} from "lucide-react";

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
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const r = await axios.get("/api/profile");
      return r.data;
    },
    retry: 1,
    staleTime: 60_000,
  });

  const restaurantId = profile?.restaurantStep1?.id as string | undefined;

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders", restaurantId],
    queryFn: async () => {
      const r = await axios.get("/api/orders");
      return r.data;
    },
    enabled: Boolean(restaurantId),
    retry: 1,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (!restaurantId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
      cluster: (process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "") as string,
    });

    const channel = pusher.subscribe(`restaurant-${restaurantId}`);
    channel.bind("new-order", (payload: any) => {
      toast.success(
        `New order #${payload.orderNumber} • Table ${
          payload.tableNumber ?? "—"
        }`
      );
      queryClient.invalidateQueries({ queryKey: ["orders", restaurantId] });
    });
    channel.bind("order-update", (payload: any) => {
      toast(`${payload.message || "Order updated"}`);
      queryClient.invalidateQueries({ queryKey: ["orders", restaurantId] });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [restaurantId, queryClient]);

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
          <Toaster position="top-right" />
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Orders</h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-8 md:w-[240px] lg:w-[340px]"
                    onChange={() => {}}
                    aria-label="Search orders"
                  />
                </div>

                <Button
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["orders", restaurantId],
                    })
                  }
                >
                  Refresh
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {isLoading ? (
                  <div>Loading orders...</div>
                ) : (
                  <div className="grid gap-4">
                    {orders.map((o) => (
                      <OrderCard key={o.id} order={o} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="processing" className="space-y-4">
                <div className="grid gap-4">
                  {orders
                    .filter(
                      (o) =>
                        o.status === "PENDING" ||
                        o.status === "IN_PROGRESS" ||
                        o.status === "CONFIRMED"
                    )
                    .map((o) => (
                      <OrderCard key={o.id} order={o} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <div className="grid gap-4">
                  {orders
                    .filter((o) => o.status === "COMPLETED")
                    .map((o) => (
                      <OrderCard key={o.id} order={o} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="cancelled" className="space-y-4">
                <div className="grid gap-4">
                  {orders
                    .filter((o) => o.status === "CANCELLED")
                    .map((o) => (
                      <OrderCard key={o.id} order={o} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const queryClient = useQueryClient();

  const patchMutation = useMutation({
    mutationFn: async (payload: { id: string; status: Order["status"] }) => {
      const res = await axios.patch(`/api/orders/${payload.id}`, {
        status: payload.status,
      });
      return res.data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previous = queryClient.getQueryData<Order[]>(["orders"]);
      queryClient.setQueryData<Order[] | undefined>(["orders"], (old) =>
        old?.map((o) => (o.id === id ? { ...o, status } : o))
      );
      return { previous };
    },
    onError: (err, variables, context: any) => {
      toast.error("Failed to update order");
      if (context?.previous) {
        queryClient.setQueryData(["orders"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onSuccess: () => {
      toast.success("Order updated");
    },
  });

  const statusActions = getStatusActions(order.status);

  return (
    <Card>
      <CardHeader className="flex items-start justify-between pb-2">
        <div>
          <CardTitle className="text-base">
            #{order.orderNumber} • Table {order.tableNumber ?? "—"}
          </CardTitle>
          <CardDescription>{friendlyDate(order.createdAt)}</CardDescription>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={order.status} />
          <div className="text-right text-sm font-medium">
            ₹{order.totalAmount}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-medium">Items</h4>
            <ul className="space-y-1 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}× {item.menuItem?.name}
                  </span>
                  <span>₹{item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2 flex justify-between border-t pt-2 text-sm font-medium">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Actions</h4>

            <div className="flex flex-wrap gap-2">
              {statusActions.map((act) => (
                <Button
                  key={act.key}
                  size="sm"
                  variant={act.variant}
                  onClick={() => {
                    if (act.confirm && !confirm(act.confirm)) return;
                    patchMutation.mutate({
                      id: order.id,
                      status: act.nextStatus,
                    });
                  }}
                >
                  {act.label}
                </Button>
              ))}

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      `${location.origin}/dashboard/orders/${order.id}`
                    )
                    .then(() => toast.success("Link copied"))
                    .catch(() => toast.error("Failed to copy link"));
                }}
              >
                Share
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Payment: {order.paid ? "Paid" : "Unpaid"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-2 px-2 py-1",
        status === "COMPLETED" &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
        status === "IN_PROGRESS" &&
          "border-amber-500/20 bg-amber-500/10 text-amber-600",
        status === "PENDING" &&
          "border-amber-500/20 bg-amber-500/10 text-amber-600",
        status === "CONFIRMED" &&
          "border-sky-500/20 bg-sky-500/10 text-sky-600",
        status === "CANCELLED" && "border-red-500/20 bg-red-500/10 text-red-600"
      )}
    >
      {status === "COMPLETED" && <CheckCircleIcon className="h-3.5 w-3.5" />}
      {(status === "PENDING" ||
        status === "IN_PROGRESS" ||
        status === "CONFIRMED") && <ClockIcon className="h-3.5 w-3.5" />}
      {status === "CANCELLED" && <XCircleIcon className="h-3.5 w-3.5" />}
      <span className="capitalize">
        {status.toLowerCase().replace("_", " ")}
      </span>
    </Badge>
  );
}

type Action = {
  key: string;
  label: string;
  nextStatus: Order["status"];
  variant?: "default" | "outline" | "destructive";
  confirm?: string | null;
};

function getStatusActions(current: Order["status"]): Action[] {
  // allowed transitions and button labels
  switch (current) {
    case "PENDING":
      return [
        {
          key: "confirm",
          label: "Confirm",
          nextStatus: "CONFIRMED",
          variant: "default",
        },
        {
          key: "start",
          label: "Start Cooking",
          nextStatus: "IN_PROGRESS",
          variant: "default",
          confirm: "Start preparing this order?",
        },
        {
          key: "cancel",
          label: "Cancel",
          nextStatus: "CANCELLED",
          variant: "destructive",
          confirm: "Cancel this order?",
        },
      ];
    case "CONFIRMED":
      return [
        {
          key: "start",
          label: "Start Cooking",
          nextStatus: "IN_PROGRESS",
          variant: "default",
          confirm: "Start preparing this order?",
        },
        {
          key: "cancel",
          label: "Cancel",
          nextStatus: "CANCELLED",
          variant: "destructive",
          confirm: "Cancel this order?",
        },
      ];
    case "IN_PROGRESS":
      return [
        {
          key: "ready",
          label: "Mark Ready",
          nextStatus: "COMPLETED",
          variant: "default",
          confirm: "Mark as completed?",
        },
        {
          key: "cancel",
          label: "Cancel",
          nextStatus: "CANCELLED",
          variant: "destructive",
          confirm: "Cancel this order?",
        },
      ];
    case "COMPLETED":
      return [
        {
          key: "reopen",
          label: "Reopen (to In Progress)",
          nextStatus: "IN_PROGRESS",
          variant: "outline",
          confirm: "Re-open this order?",
        },
      ];
    case "CANCELLED":
      return [
        {
          key: "reopen",
          label: "Reopen (to Pending)",
          nextStatus: "PENDING",
          variant: "outline",
          confirm: "Re-open this order?",
        },
      ];
    default:
      return [];
  }
}
