"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function TableQRCode({ onClose }: { onClose: () => void }) {
  const [number, setNumber] = useState("");
  const queryClient = useQueryClient();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return toast.error("Enter table number");

    try {
      const res = await fetch("/api/table-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: Number(number) }),
      });

      if (!res.ok) throw new Error();

      toast.success("QR created for table " + number);
      queryClient.invalidateQueries({ queryKey: ["table-qr"] });
      setNumber("");
      onClose();
    } catch {
      toast.error("Failed to create QR");
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="space-y-4">
        <Label>Table Number</Label>
        <Input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#eb0029]">
            Generate
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}
