import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({
  revenue,
  totalOrders,
  todaysOrders,
  qrScans,
}: {
  revenue: number;
  totalOrders: number;
  todaysOrders: number;
  qrScans: number;
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* Total Revenue */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₹{revenue.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue growing <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on recent paid orders
          </div>
        </CardFooter>
      </Card>

      {/* Total Orders */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOrders}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Stable order flow <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Lifetime orders for this restaurant
          </div>
        </CardFooter>
      </Card>

      {/* Today's Orders */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>Today's Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {todaysOrders}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {todaysOrders > 0 ? (
                <>
                  <IconTrendingUp className="size-4" /> Active
                </>
              ) : (
                <>
                  <IconTrendingDown className="size-4" /> Low
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Live orders today
          </div>
          <div className="text-muted-foreground">
            Auto-updates with new orders
          </div>
        </CardFooter>
      </Card>

      {/* QR Scans */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>QR Scans</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {qrScans}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              {qrScans > 0 ? "+Scan Activity" : "No Scans"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Table QR usage data
          </div>
          <div className="text-muted-foreground">
            Tracks how many times customers scanned tables
          </div>
        </CardFooter>
      </Card>

    </div>
  );
}
