"use client";

import { PlusIcon, QrCodeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import QRCodeCard from "./QRCodeCard";
import TableQRCode from "./TableQRCode";


interface TableQR {
  id: string;
  number: number;
  scan: number;
  qrCodeUrl: string;
  createdAt: string;
}

export default function QRCodesPage() {
  const [open, setOpen] = useState(false);

  const { data = [], isLoading, isError } = useQuery<TableQR[]>({
    queryKey: ["table-qr"],
    queryFn: async () => {
      const res = await axios.get("/api/table-qr");
      return res.data;
    },
    staleTime: 10_000,
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading QR</div>;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">QR Code Management</h2>
          <p className="text-muted-foreground">
            Manage QR codes for your tables
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#006aff] hover:bg-[#0051cc]">
              <PlusIcon className="mr-2 h-4 w-4" />
              Generate QR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add QR Code</DialogTitle>
              <DialogDescription>Enter table number</DialogDescription>
            </DialogHeader>
            <TableQRCode onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tables">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.map((item) => (
              <QRCodeCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm">Total Scans</CardTitle>
                <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.reduce((a, b) => a + b.scan, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
