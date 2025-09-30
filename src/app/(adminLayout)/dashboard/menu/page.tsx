"use client"

import { useState } from "react"
import { PlusIcon, EditIcon, TrashIcon, DollarSignIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddMenuItemForm from "./AddMenuItemForm"
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shadcn-components/app-sidebar"
import AddCategoryItem from "./AddCategoryItem"
interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  category: string
  image: string
  available: boolean
  preparationTime: number
  allergens: string[]
  isPopular: boolean
  isNew: boolean
}

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, fresh mozzarella, and basil leaves",
    price: "12.99",
    category: "Main Courses",
    image: "/placeholder.svg?height=200&width=400",
    available: true,
    preparationTime: 15,
    allergens: ["Gluten", "Dairy"],
    isPopular: true,
    isNew: false,
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, croutons, parmesan cheese with Caesar dressing",
    price: "8.50",
    category: "Appetizers",
    image: "/placeholder.svg?height=200&width=400",
    available: true,
    preparationTime: 8,
    allergens: ["Dairy", "Eggs"],
    isPopular: false,
    isNew: false,
  },
  {
    id: 3,
    name: "Beef Burger",
    description: "Angus beef patty with lettuce, tomato, cheese, and our special sauce",
    price: "9.99",
    category: "Main Courses",
    image: "/placeholder.svg?height=200&width=400",
    available: true,
    preparationTime: 12,
    allergens: ["Gluten", "Dairy"],
    isPopular: true,
    isNew: false,
  },
  {
    id: 4,
    name: "Tiramisu",
    description: "Italian dessert made of ladyfingers dipped in coffee with mascarpone cream",
    price: "6.99",
    category: "Desserts",
    image: "/placeholder.svg?height=200&width=400",
    available: true,
    preparationTime: 5,
    allergens: ["Dairy", "Eggs", "Gluten"],
    isPopular: false,
    isNew: false,
  },
  {
    id: 5,
    name: "Truffle Pasta",
    description: "Fresh pasta with truffle oil, mushrooms, and parmesan cheese",
    price: "18.99",
    category: "Main Courses",
    image: "/placeholder.svg?height=200&width=400",
    available: true,
    preparationTime: 18,
    allergens: ["Gluten", "Dairy"],
    isPopular: false,
    isNew: true,
  },
  {
    id: 6,
    name: "Craft IPA",
    description: "Local craft beer with citrus notes and hoppy finish",
    price: "5.99",
    category: "Drinks",
    image: "/placeholder.svg?height=200&width=400",
    available: false,
    preparationTime: 2,
    allergens: ["Gluten"],
    isPopular: false,
    isNew: false,
  },
]

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false)


  const categories = ["all", "Appetizers", "Main Courses", "Desserts", "Drinks"]

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const deleteItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const getItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category)
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
            <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
            <p className="text-muted-foreground">Manage your restaurant menu items and categories</p>
          </div>
          <div className="flex gap-2 ">
             <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Add New Category Item</DialogTitle>
                <DialogDescription>Create a new category for Food</DialogDescription>
              </DialogHeader>
              <AddCategoryItem onClose={() => setIsAddCategoryOpen(false)} />
            </DialogContent>
          </Dialog>
          <Dialog open={isAddMenuItemOpen} onOpenChange={setIsAddMenuItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>Create a new item for your menu. Fill in all the details below.</DialogDescription>
              </DialogHeader>
              <AddMenuItemForm onClose={() => setIsAddMenuItemOpen(false)} />
            </DialogContent>
          </Dialog>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.length}</div>
              <p className="text-xs text-muted-foreground">Active menu items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Items</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.filter((item) => item.available).length}</div>
              <p className="text-xs text-muted-foreground">Currently available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.filter((item) => item.isPopular).length}</div>
              <p className="text-xs text-muted-foreground">Customer favorites</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {(menuItems.reduce((sum, item) => sum + Number.parseFloat(item.price), 0) / menuItems.length).toFixed(
                  2,
                )}
              </div>
              <p className="text-xs text-muted-foreground">Average item price</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onToggle={toggleAvailability} onDelete={deleteItem} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <MenuItemListCard key={item.id} item={item} onToggle={toggleAvailability} onDelete={deleteItem} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {categories.slice(1).map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold">{category}</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getItemsByCategory(category).map((item) => (
                    <MenuItemCard key={item.id} item={item} onToggle={toggleAvailability} onDelete={deleteItem} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

        </SidebarInset>
    
        </SidebarProvider>
    </div>
  )
}

function MenuItemCard({
  item,
  onToggle,
  onDelete,
}: {
  item: MenuItem
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <Card className={`${!item.available ? "opacity-60" : ""}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
          <div className="absolute top-2 left-2 flex gap-1">
            {item.isPopular && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                Popular
              </Badge>
            )}
            {item.isNew && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                New
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant={item.available ? "default" : "secondary"}>
              {item.available ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <span className="font-bold text-lg">${item.price}</span>
        </div>
        <CardDescription className="line-clamp-2 mb-3">{item.description}</CardDescription>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Prep time: {item.preparationTime} min</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.allergens.map((allergen) => (
              <Badge key={allergen} variant="outline" className="text-xs">
                {allergen}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(item.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button variant={item.available ? "destructive" : "default"} size="sm" onClick={() => onToggle(item.id)}>
          {item.available ? "Disable" : "Enable"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function MenuItemListCard({
  item,
  onToggle,
  onDelete,
}: {
  item: MenuItem
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <Card className={`${!item.available ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">${item.price}</div>
                <div className="text-sm text-muted-foreground">{item.preparationTime} min</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{item.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {item.isPopular && (
                  <Badge variant="secondary" className="bg-orange-500 text-white text-xs">
                    Popular
                  </Badge>
                )}
                {item.isNew && (
                  <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                    New
                  </Badge>
                )}
                <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(item.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={item.available ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onToggle(item.id)}
                >
                  {item.available ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}