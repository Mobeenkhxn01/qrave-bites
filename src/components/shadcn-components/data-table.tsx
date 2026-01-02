"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface NotificationRow {
  id: string;
  orderNumber: number;
  tableNumber: number | null;
  type: string;
  message: string;
  createdAt: string;
  status: string;
  amount: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-600 border-amber-600/50",
  CONFIRMED: "bg-blue-500/15 text-blue-600 border-blue-600/50",
  IN_PROGRESS: "bg-purple-500/15 text-purple-600 border-purple-600/50",
  COMPLETED: "bg-emerald-500/15 text-emerald-600 border-emerald-600/50",
  CANCELLED: "bg-red-500/15 text-red-600 border-red-600/50",
};

export const columns: ColumnDef<NotificationRow>[] = [
  {
    header: "Order",
    accessorKey: "orderNumber",
    cell: ({ row }) => (
      <span className="font-semibold">#{row.original.orderNumber}</span>
    ),
  },
  {
    header: "Table",
    accessorKey: "tableNumber",
    cell: ({ row }) =>
      row.original.tableNumber ? (
        <Badge variant="outline" className="px-2 py-1">
          T-{row.original.tableNumber}
        </Badge>
      ) : (
        "N/A"
      ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={cn("border", statusColors[status] || "")}>
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => <p>₹{row.original.amount.toFixed(2)}</p>,
  },
  {
    header: "Message",
    accessorKey: "message",
    cell: ({ row }) => (
      <p className="text-muted-foreground line-clamp-1 w-50">
        {row.original.message}
      </p>
    ),
  },
  {
    header: "Time",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: () => (
      <Button size="sm" variant="outline">
        View
      </Button>
    ),
  },
];

export default function OrdersTable() {
  const { data: notifications = [] } = useQuery<NotificationRow[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get("/api/notifications");
      return res.data?.notifications ?? []; 
    },
  });

  const table = useReactTable({
    data: notifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Notifications</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {notifications.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-muted-foreground"
                >
                  No notifications yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
