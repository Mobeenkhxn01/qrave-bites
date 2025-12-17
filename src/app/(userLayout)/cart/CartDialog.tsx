"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartContext } from "@/context/CardContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function CartDialog({
  tableId,
  restaurantId,
}: {
  tableId: string | null;
  restaurantId: string;
}) {
  const { cart, isLoading, addToCart, removeFromCart, clearCart, totalPrice } =
    useCartContext();

  const handleQtyChange = (menuItemId: string, change: number) => {
    change > 0
      ? addToCart(menuItemId, tableId)
      : removeFromCart(menuItemId, tableId);

    toast.success("Cart updated");
  };

  const handleCheckout = async () => {
    if (!tableId || !cart?.id) {
      toast.error("Table not detected");
      return;
    }

    try {
      const res = await axios.post("/api/orders", {
        cartId: cart.id,
        tableId,
        restaurantId,
      });

      toast.success(`Order #${res.data.order.orderNumber} placed`);
      clearCart(tableId);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Checkout failed");
    }
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
          <div className="p-4 space-y-4">
            <p className="font-bold">Total: ₹{totalPrice.toFixed(2)}</p>

            <Button
              className="w-full bg-[#eb0029]"
              onClick={handleCheckout}
              disabled={!cart || cart.cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
