import { CheckCircleIcon, ClockIcon, SearchIcon, XCircleIcon } from "lucide-react"
import {
  SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"

export default function OrdersPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full bg-background pl-8 md:w-[240px] lg:w-[340px]"
              />
            </div>
            <Button>Export</Button>
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
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <div className="grid gap-4">
              {orders
                .filter((order) => order.status === "processing")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {orders
                .filter((order) => order.status === "completed")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <div className="grid gap-4">
              {orders
                .filter((order) => order.status === "cancelled")
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
        </SidebarInset>
        </SidebarProvider>
    </div>
  )
}

type OrderStatus = "completed" | "processing" | "cancelled"

interface OrderItem {
  name: string
  quantity: number
  price: string
}

interface Order {
  id: string
  customer: string
  email: string
  phone: string
  date: string
  time: string
  items: OrderItem[]
  total: string
  status: OrderStatus
  paymentMethod: string
  orderType: "Dine-in" | "Takeaway" | "Delivery"
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">
            {order.id} - {order.customer}
          </CardTitle>
          <CardDescription>
            {order.date} • {order.time} • {order.orderType}
          </CardDescription>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-medium">Order Items</h4>
            <ul className="space-y-1 text-sm">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>${item.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t pt-2 text-sm font-medium">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium">Customer Details</h4>
            <div className="space-y-1 text-sm">
              <p>{order.customer}</p>
              <p>{order.email}</p>
              <p>{order.phone}</p>
            </div>
            <h4 className="mb-2 mt-4 text-sm font-medium">Payment</h4>
            <p className="text-sm">{order.paymentMethod}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">
                View Details
              </Button>
              {order.status === "processing" && <Button size="sm">Mark as Complete</Button>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 px-2 py-1",
        status === "completed" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        status === "processing" && "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        status === "cancelled" && "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
      )}
    >
      {status === "completed" && <CheckCircleIcon className="h-3.5 w-3.5" />}
      {status === "processing" && <ClockIcon className="h-3.5 w-3.5" />}
      {status === "cancelled" && <XCircleIcon className="h-3.5 w-3.5" />}
      <span className="capitalize">{status}</span>
    </Badge>
  )
}

const orders: Order[] = [
  {
    id: "ORD-7429",
    customer: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    date: "May 31, 2025",
    time: "12:32 PM",
    items: [
      { name: "Beef Burger", quantity: 1, price: "9.99" },
      { name: "French Fries", quantity: 1, price: "3.99" },
      { name: "Coke", quantity: 1, price: "1.99" },
    ],
    total: "15.97",
    status: "completed",
    paymentMethod: "Credit Card",
    orderType: "Dine-in",
  },
  {
    id: "ORD-7428",
    customer: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    date: "May 31, 2025",
    time: "12:28 PM",
    items: [{ name: "Margherita Pizza", quantity: 2, price: "24.98" }],
    total: "24.98",
    status: "processing",
    paymentMethod: "Cash",
    orderType: "Takeaway",
  },
  {
    id: "ORD-7427",
    customer: "Michael Brown",
    email: "michael.b@example.com",
    phone: "(555) 345-6789",
    date: "May 31, 2025",
    time: "12:20 PM",
    items: [
      { name: "Caesar Salad", quantity: 1, price: "8.50" },
      { name: "Lemonade", quantity: 1, price: "2.99" },
    ],
    total: "11.49",
    status: "processing",
    paymentMethod: "Credit Card",
    orderType: "Delivery",
  },
  {
    id: "ORD-7426",
    customer: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 456-7890",
    date: "May 31, 2025",
    time: "12:15 PM",
    items: [
      { name: "Pasta Carbonara", quantity: 1, price: "14.99" },
      { name: "Garlic Bread", quantity: 1, price: "3.99" },
      { name: "Tiramisu", quantity: 1, price: "6.99" },
    ],
    total: "25.97",
    status: "cancelled",
    paymentMethod: "Credit Card",
    orderType: "Delivery",
  },
  {
    id: "ORD-7425",
    customer: "Robert Wilson",
    email: "robert.w@example.com",
    phone: "(555) 567-8901",
    date: "May 31, 2025",
    time: "12:05 PM",
    items: [
      { name: "Chicken Wings", quantity: 2, price: "15.98" },
      { name: "Coke", quantity: 2, price: "3.98" },
    ],
    total: "19.96",
    status: "completed",
    paymentMethod: "Cash",
    orderType: "Dine-in",
  },
]
