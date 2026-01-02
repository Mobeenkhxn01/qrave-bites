"use client";
import {
  PlusIcon,
  QrCodeIcon
} from "lucide-react";

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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableQRCode from "./TableQRCode";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import QRCodeCard from "./QRCodeCard";

interface tableQR {
  id: string;
  number: number;
  scan:number; 
  qrCodeUrl: string;
  createdAt: string;
}

export default function QRCodesPage() {
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const {
    data: tables = [],
    isLoading,
    isError,
  } = useQuery<tableQR[]>({
    queryKey: ["table-qr"],
    queryFn: async () => {
      const res = await axios.get("/api/table-qr");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading QR codes...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load QR codes.</div>;

  return (

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  QR Code Management
                </h2>
                <p className="text-muted-foreground">
                  Manage QR codes for your tables and track their performance
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={isAddMenuItemOpen}
                  onOpenChange={setIsAddMenuItemOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" /> Generate QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-162.5">
                    <DialogHeader>
                      <DialogTitle>Add Qr code for table</DialogTitle>
                      <DialogDescription>
                        Fill in all details below
                      </DialogDescription>
                    </DialogHeader>
                    <TableQRCode onClose={() => setIsAddMenuItemOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Tabs defaultValue="tables" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tables">Table QR Codes</TabsTrigger>
                <TabsTrigger value="analytics">QR Analytics</TabsTrigger>
                <TabsTrigger value="settings">QR Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="tables" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tables.map((item) => (
                    <QRCodeCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Scans Today
                      </CardTitle>
                      <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">247</div>
                      <p className="text-xs text-muted-foreground">
                        +12.5% from yesterday
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Conversion Rate
                      </CardTitle>
                      <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">68.4%</div>
                      <p className="text-xs text-muted-foreground">
                        +5.2% from yesterday
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Most Scanned Table
                      </CardTitle>
                      <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Table 7</div>
                      <p className="text-xs text-muted-foreground">
                        34 scans today
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Average Order Value
                      </CardTitle>
                      <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$32.15</div>
                      <p className="text-xs text-muted-foreground">
                        +8.1% from yesterday
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Settings</CardTitle>
                    <CardDescription>
                      Configure how your QR codes work and what customers see
                      when they scan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Landing Page URL
                        </label>
                        <div className="text-sm text-muted-foreground">
                          https://qrave-bites.com/menu/bella-vista
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          QR Code Style
                        </label>
                        <div className="text-sm text-muted-foreground">
                          Standard Black & White
                        </div>
                      </div>
                    </div>
                    <Button>Update Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
     
  );
}
