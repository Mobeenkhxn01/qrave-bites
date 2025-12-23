"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function ContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] h-[85vh] max-w-none p-0 overflow-hidden">
  <div className="grid grid-cols-1 md:grid-cols-2 h-full">

    {/* LEFT IMAGE */}
    <div className="relative hidden md:block">
      <Image
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
        alt="Contact"
        fill
        className="object-cover"
        priority
      />
    </div>

          {/* ===== RIGHT FORM ===== */}
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Contact Us</DialogTitle>
              <DialogDescription>
                Fill the form and we’ll get back to you.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input placeholder="Your name" />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Submit</Button>
            </DialogFooter>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
