"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/hooks/useCart";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Trash from "@/components/icons/Trash";

export default function CartDialog() {
  const searchParams = useSearchParams();
  const tableNumber = Number(searchParams.get("table")) || null;

  const {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart(tableNumber);

  const handleQtyChange = (menuItemId: string, change: number) => {
    change > 0 ? addToCart(menuItemId) : removeFromCart(menuItemId);
    toast.success("Cart updated");
  };

  const handleCheckout = async () => {
    if (!tableNumber) {
      toast.error("Table number missing!");
      return;
    }

    const res = await axios.post("/api/checkout", { tableNumber });
    window.location.href = res.data.url;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="bg-[#eb0029] text-white fixed bottom-20 right-4 z-50 shadow-xl rounded-full h-14 w-14"
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-10 text-center">Loading cart...</div>
        ) : (
          <div className="p-4">
            <p className="font-bold mb-4">Total: ₹{totalPrice.toFixed(2)}</p>

            <Button
              className="w-full bg-[#eb0029]"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
