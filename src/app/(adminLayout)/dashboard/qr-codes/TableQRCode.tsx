"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function TableQRCode({ onClose }: { onClose: () => void }) {
  const [number, setNumber] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number) return toast.error("Enter table number!");

    try {
      const res = await fetch("/api/table-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: Number(number) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("QR Code created!");
      setNumber("");
      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Failed to create QR");
    }
  };

  return (
    <form onSubmit={handleGenerate}>
      <div className="flex flex-col gap-3 max-w-sm mx-auto mt-6">
        <Label>Table Number</Label>
        <Input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter table number"
        />

        <DialogFooter className="space-y-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="bg-[#eb0029] w-full">Generate QR</Button>
        </DialogFooter>
      </div>
    </form>
  );
}
