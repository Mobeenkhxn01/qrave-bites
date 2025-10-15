"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";

export default function TableQRCode({ onClose }: { onClose: () => void }) {
  const [number, setNumber] = useState<string>("");
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;
    const menuUrl = `${window.location.origin}/menu?table=${number}`;
    try {
      const qrCodeUrl = await QRCode.toDataURL(menuUrl);
      const res = await fetch("/api/table-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: Number(number), qrCodeUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save QR");

      toast.success("QR Code generated successfully!");
      onClose();
      setNumber("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate QR");
    }
  };

  return (
    <form onSubmit={handleGenerate}>
      <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto mt-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
            id="tableNumber"
            placeholder="Enter table number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <DialogFooter className="w-full space-y-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#eb0029] w-full ">
            Generate QR Code
          </Button>
        </DialogFooter>
        <Toaster position="top-center" />
      </div>
    </form>
  );
}
