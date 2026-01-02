"use client";

import {
  BellIcon,
  SearchIcon,
  WifiIcon,
  MoonIcon,
  SunIcon,
  SettingsIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader({
  restaurantId,
}: {
  restaurantId?: string;
}) {
  const { setTheme, theme } = useTheme();
  const { data: notifications = [] } = useNotifications(restaurantId);

const unreadCount = notifications.filter(
  (n: any) => !n.isRead
).length;


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 md:px-6">
      <SidebarTrigger />
      <div className="hidden md:flex md:flex-1">
        <form className="flex-1 md:max-w-sm">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders, tables, customers..."
              className="w-full bg-background pl-8 md:w-60 lg:w-85"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-2 md:ml-auto md:gap-4">
        <div className="hidden md:flex items-center gap-2">
          <WifiIcon className="h-4 w-4 text-green-500" />
          <Badge variant="outline" className="text-green-600 border-green-200">
            Online
          </Badge>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm font-medium">Table 7 just ordered</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative"
            >
              <BellIcon className="h-4 w-4" />
              {unreadCount > 0 && (
  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
    {unreadCount}
  </Badge>
)}

              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
  <DropdownMenuSeparator />

  {notifications.length === 0 && (
    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
      No notifications
    </div>
  )}

  {notifications.slice(0, 5).map((n: any) => (
    <DropdownMenuItem key={n.id} className="cursor-pointer">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{n.message}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(n.createdAt).toLocaleString()}
        </span>
      </div>
    </DropdownMenuItem>
  ))}
</DropdownMenuContent>

        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg"
                  width={32}
                  height={32}
                  alt="User"
                  className="object-cover"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john@bellavista.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
