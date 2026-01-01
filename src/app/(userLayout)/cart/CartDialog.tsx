"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartContext } from "@/context/CardContext";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

export default function CartDialog({
  tableId,
  restaurantId,
}: {
  tableId: string | null;
  restaurantId: string;
}) {
  const { cart, isLoading, addToCart, removeFromCart, totalPrice } =
    useCartContext();

  const [phone, setPhone] = useState("");

  const handleCheckout = async () => {
    if (!tableId) {
      toast.error("Table not detected");
      return;
    }

    if (!phone || phone.length < 8) {
      toast.error("Enter valid phone number");
      return;
    }

    try {
      // 1️⃣ Create order
      const orderRes = await axios.post("/api/orders", {
        tableId,
        restaurantId,
        phone,
      });

      const order = orderRes.data.order;

      // 2️⃣ Create Stripe session USING ORDER ID
      const stripeRes = await axios.post("/api/checkout", {
        orderId: order.id,
      });

      window.location.href = stripeRes.data.url;
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-[#eb0029] text-white"
        >
          <ShoppingCart />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
        </DialogHeader>

        {isLoading || !cart ? (
          <div className="text-center p-6">Loading...</div>
        ) : (
          <>
            {cart.cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b py-3">
                <Image
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  width={60}
                  height={60}
                  className="rounded"
                />

                <div className="flex-1">
                  <p>{item.menuItem.name}</p>
                  <p>₹{item.menuItem.price}</p>

                  <div className="flex gap-2 mt-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        removeFromCart(item.menuItem.id, tableId)
                      }
                    >
                      <Minus size={14} />
                    </Button>

                    <span>{item.quantity}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        addToCart(item.menuItem.id, tableId)
                      }
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>

                <div>
                  ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <input
              className="w-full border rounded px-3 py-2 mt-4"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="flex justify-between font-bold mt-4">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-4 bg-[#eb0029]"
              onClick={handleCheckout}
            >
              Proceed to Payment
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
