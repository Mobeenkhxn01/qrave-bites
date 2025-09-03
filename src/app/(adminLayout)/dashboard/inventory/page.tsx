import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header"
import { PackageIcon, AlertTriangleIcon, TrendingDownIcon, PlusIcon } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shadcn-components/app-sidebar"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  cost: number
  supplier: string
  lastRestocked: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Tomatoes",
    category: "Vegetables",
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    unit: "kg",
    cost: 3.5,
    supplier: "Fresh Farm Co.",
    lastRestocked: "2 days ago",
    status: "low-stock",
  },
  {
    id: "2",
    name: "Mozzarella Cheese",
    category: "Dairy",
    currentStock: 25,
    minStock: 15,
    maxStock: 40,
    unit: "kg",
    cost: 12.0,
    supplier: "Dairy Direct",
    lastRestocked: "1 day ago",
    status: "in-stock",
  },
  {
    id: "3",
    name: "Ground Beef",
    category: "Meat",
    currentStock: 0,
    minStock: 8,
    maxStock: 30,
    unit: "kg",
    cost: 18.5,
    supplier: "Prime Meats",
    lastRestocked: "5 days ago",
    status: "out-of-stock",
  },
  {
    id: "4",
    name: "Pizza Dough",
    category: "Bakery",
    currentStock: 45,
    minStock: 20,
    maxStock: 60,
    unit: "pieces",
    cost: 0.75,
    supplier: "Local Bakery",
    lastRestocked: "Today",
    status: "in-stock",
  },
]

export default function InventoryPage() {
  const lowStockItems = inventoryItems.filter((item) => item.status === "low-stock").length
  const outOfStockItems = inventoryItems.filter((item) => item.status === "out-of-stock").length
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.currentStock * item.cost, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "text-green-600 bg-green-100 border-green-200"
      case "low-stock":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "out-of-stock":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

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
            <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
            <p className="text-muted-foreground">Track and manage your restaurant inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <PackageIcon className="mr-2 h-4 w-4" />
              Restock Alert
            </Button>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Current stock value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingDownIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">Items unavailable</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
              <p className="text-xs text-muted-foreground">Items in inventory</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {inventoryItems.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  getStatusColor={getStatusColor}
                  getStockPercentage={getStockPercentage}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            <div className="grid gap-4">
              {inventoryItems
                .filter((item) => item.status === "low-stock")
                .map((item) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    getStatusColor={getStatusColor}
                    getStockPercentage={getStockPercentage}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="out-of-stock" className="space-y-4">
            <div className="grid gap-4">
              {inventoryItems
                .filter((item) => item.status === "out-of-stock")
                .map((item) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    getStatusColor={getStatusColor}
                    getStockPercentage={getStockPercentage}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {["Vegetables", "Dairy", "Meat", "Bakery"].map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <CardDescription>
                      {inventoryItems.filter((item) => item.category === category).length} items
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {inventoryItems
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-sm">{item.name}</span>
                            <Badge className={getStatusColor(item.status)}>{item.status.replace("-", " ")}</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
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

function InventoryItemCard({
  item,
  getStatusColor,
  getStockPercentage,
}: {
  item: InventoryItem
  getStatusColor: (status: string) => string
  getStockPercentage: (current: number, max: number) => number
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.category}</p>
          </div>
          <Badge className={getStatusColor(item.status)}>{item.status.replace("-", " ")}</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Stock:</span>
              <span className="font-medium">
                {item.currentStock} {item.unit}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Min Stock:</span>
              <span>
                {item.minStock} {item.unit}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Max Stock:</span>
              <span>
                {item.maxStock} {item.unit}
              </span>
            </div>
            <Progress value={getStockPercentage(item.currentStock, item.maxStock)} className="mt-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cost per unit:</span>
              <span className="font-medium">${item.cost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Supplier:</span>
              <span>{item.supplier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Last restocked:</span>
              <span>{item.lastRestocked}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total value:</span>
              <span className="font-medium">${(item.currentStock * item.cost).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">
            Edit
          </Button>
          <Button size="sm">Restock</Button>
        </div>
      </CardContent>
    </Card>
  )
}
