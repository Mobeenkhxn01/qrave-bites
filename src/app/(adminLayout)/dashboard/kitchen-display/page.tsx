"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header"
import { ClockIcon, CheckCircleIcon, AlertTriangleIcon, ChefHatIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/shadcn-components/app-sidebar"
import {
  SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

interface KitchenOrder {
  id: string
  table: number
  items: Array<{
    name: string
    quantity: number
    notes?: string
    status: "pending" | "preparing" | "ready"
  }>
  orderTime: string
  estimatedTime: number
  priority: "low" | "medium" | "high"
  status: "new" | "preparing" | "ready" | "served"
}

const mockOrders: KitchenOrder[] = [
  {
    id: "ORD-8901",
    table: 7,
    items: [
      { name: "Margherita Pizza", quantity: 2, status: "preparing" },
      { name: "Caesar Salad", quantity: 1, notes: "No croutons", status: "ready" },
    ],
    orderTime: "12:45 PM",
    estimatedTime: 8,
    priority: "high",
    status: "preparing",
  },
  {
    id: "ORD-8902",
    table: 3,
    items: [
      { name: "Beef Burger", quantity: 1, notes: "Medium rare", status: "pending" },
      { name: "French Fries", quantity: 1, status: "pending" },
    ],
    orderTime: "12:50 PM",
    estimatedTime: 12,
    priority: "medium",
    status: "new",
  },
  {
    id: "ORD-8903",
    table: 11,
    items: [
      { name: "Pasta Carbonara", quantity: 1, status: "ready" },
      { name: "Garlic Bread", quantity: 1, status: "ready" },
    ],
    orderTime: "12:35 PM",
    estimatedTime: 0,
    priority: "high",
    status: "ready",
  },
]

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockOrders)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const updateItemStatus = (orderId: string, itemIndex: number, newStatus: "pending" | "preparing" | "ready") => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item, index) => (index === itemIndex ? { ...item, status: newStatus } : item)),
            }
          : order,
      ),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-200 text-red-800"
      case "medium":
        return "bg-yellow-100 border-yellow-200 text-yellow-800"
      case "low":
        return "bg-green-100 border-green-200 text-green-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "border-blue-500 bg-blue-50"
      case "preparing":
        return "border-orange-500 bg-orange-50"
      case "ready":
        return "border-green-500 bg-green-50"
      default:
        return "border-gray-300 bg-white"
    }
  }

  const newOrders = orders.filter((order) => order.status === "new")
  const preparingOrders = orders.filter((order) => order.status === "preparing")
  const readyOrders = orders.filter((order) => order.status === "ready")

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
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ChefHatIcon className="h-8 w-8" />
              Kitchen Display System
            </h2>
            <p className="text-muted-foreground">
              Current time: {currentTime.toLocaleTimeString()} • {orders.length} active orders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Average Prep Time</div>
              <div className="text-2xl font-bold">12.5 min</div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="board" className="space-y-4">
          <TabsList>
            <TabsTrigger value="board">Kitchen Board</TabsTrigger>
            <TabsTrigger value="queue">Order Queue</TabsTrigger>
            <TabsTrigger value="analytics">Kitchen Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              {/* New Orders */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">New Orders</h3>
                  <Badge variant="secondary">{newOrders.length}</Badge>
                </div>
                {newOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    onUpdateItem={updateItemStatus}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>

              {/* Preparing Orders */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Preparing</h3>
                  <Badge variant="secondary">{preparingOrders.length}</Badge>
                </div>
                {preparingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    onUpdateItem={updateItemStatus}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>

              {/* Ready Orders */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Ready for Service</h3>
                  <Badge variant="secondary">{readyOrders.length}</Badge>
                </div>
                {readyOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    onUpdateItem={updateItemStatus}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue" className="space-y-4">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className={cn("p-4", getStatusColor(order.status))}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Table {order.table}</Badge>
                      <Badge className={getPriorityColor(order.priority)}>{order.priority} priority</Badge>
                      <span className="text-sm text-muted-foreground">{order.orderTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{order.estimatedTime} min</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <span className="font-medium">
                            {item.quantity}× {item.name}
                          </span>
                          {item.notes && <div className="text-sm text-muted-foreground">Note: {item.notes}</div>}
                        </div>
                        <Badge variant={item.status === "ready" ? "default" : "secondary"}>{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                  <ChefHatIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5 min</div>
                  <p className="text-xs text-muted-foreground">-2.3 min from target</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Order Accuracy</CardTitle>
                  <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground">+0.5% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rush Orders</CardTitle>
                  <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Orders over 20 min</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
        </SidebarInset>
    </SidebarProvider>
    </div>
  )
}

function KitchenOrderCard({
  order,
  onUpdateStatus,
  onUpdateItem,
  getPriorityColor,
  getStatusColor,
}: {
  order: KitchenOrder
  onUpdateStatus: (orderId: string, status: KitchenOrder["status"]) => void
  onUpdateItem: (orderId: string, itemIndex: number, status: "pending" | "preparing" | "ready") => void
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}) {
  return (
    <Card className={cn("p-4", getStatusColor(order.status))}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Table {order.table}</Badge>
          <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <ClockIcon className="h-3 w-3" />
          {order.estimatedTime}m
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex-1">
              <div className="font-medium">
                {item.quantity}× {item.name}
              </div>
              {item.notes && <div className="text-xs text-muted-foreground">Note: {item.notes}</div>}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={item.status === "preparing" ? "default" : "outline"}
                onClick={() => onUpdateItem(order.id, index, "preparing")}
                className="text-xs px-2 py-1"
              >
                Prep
              </Button>
              <Button
                size="sm"
                variant={item.status === "ready" ? "default" : "outline"}
                onClick={() => onUpdateItem(order.id, index, "ready")}
                className="text-xs px-2 py-1"
              >
                Ready
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {order.status === "new" && (
          <Button size="sm" onClick={() => onUpdateStatus(order.id, "preparing")} className="flex-1">
            Start Preparing
          </Button>
        )}
        {order.status === "preparing" && (
          <Button size="sm" onClick={() => onUpdateStatus(order.id, "ready")} className="flex-1">
            Mark Ready
          </Button>
        )}
        {order.status === "ready" && (
          <Button size="sm" variant="outline" onClick={() => onUpdateStatus(order.id, "served")} className="flex-1">
            Served
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        Order #{order.id} • {order.orderTime}
      </div>
    </Card>
  )
}
