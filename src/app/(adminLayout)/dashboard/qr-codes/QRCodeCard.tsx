"use client";

import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface TableQR {
  id: string;
  number: number;
  scan: number;
  qrCodeUrl: string;
  createdAt: string;
}

export default function QRCodeCard({ item }: { item: TableQR }) {
  const queryClient = useQueryClient();

  const downloadQR = async () => {
    try {
      const res = await axios.get(item.qrCodeUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `table-${item.number}-qr.png`;
      a.click();
      toast.success("Downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  const regenerate = async () => {
    try {
      await axios.post("/api/table-qr/regenerate", { id: item.id });
      toast.success("QR regenerated");
      queryClient.invalidateQueries({ queryKey: ["table-qr"] });
    } catch {
      toast.error("Failed to regenerate");
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 h-24 w-24 flex items-center justify-center border rounded-lg">
          <Image
            src={item.qrCodeUrl}
            alt="qr"
            width={96}
            height={96}
          />
        </div>
        <CardTitle>Table {item.number}</CardTitle>
        <CardDescription>
          <Badge className="bg-[#006aff]">{item.scan} scans</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-2">
        <Button size="sm" variant="outline" onClick={downloadQR}>
          <DownloadIcon className="mr-1 h-3 w-3" />
          Download
        </Button>
        <Button size="sm" variant="outline" onClick={regenerate}>
          <RefreshCwIcon className="mr-1 h-3 w-3" />
          Regenerate
        </Button>
      </CardContent>
    </Card>
  );
}
