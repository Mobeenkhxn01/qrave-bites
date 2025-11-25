// app/cart/page.tsx (client component)
"use client";

import React from "react";
import Trash from "@/components/icons/Trash";
import TitleHeader from "@/components/layout/TitleHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


import { useSearchParams } from "next/navigation";

export default function Cart() {
  // ✅ CORRECT WAY IN CLIENT COMPONENT
  const searchParams = useSearchParams();
  const tableNumber = Number(searchParams.get("table")) || null;

  console.log("Cart tableNumber:", tableNumber); // should print correct number


  const {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const queryClient = useQueryClient();

  // Update quantity using same endpoints (we use the hook wrapper for add/remove)
  const handleUpdateQuantity = async (menuItemId: string, change: number) => {
    if (change > 0) {
      addToCart(menuItemId);
    } else {
      removeFromCart(menuItemId);
    }
  };

  const handleRemoveItem = (menuItemId: string) => {
    // remove single quantity (or last will delete)
    removeFromCart(menuItemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = async () => {
    try {
      console.log("Sending tableNumber:", tableNumber);
      console.log("Cart:", cart);

      const res = await axios.post("/api/checkout", { tableNumber });
      console.log("Stripe URL:", res.data.url);
      window.location.href = res.data.url;
    } catch (err: any) {
      console.log("Checkout Error Response:", err.response?.data);
      console.log("Checkout Status:", err.response?.status);
      console.error("Checkout failed", err);
      alert(err.response?.data?.error || "Checkout failed");
    }
  };

  if (isLoading) return <div>Loading cart...</div>;

  return (
    <div className="flex flex-col w-full bg-white">
      <TitleHeader title="Cart Items" subtitle="Cart" />
      <div className="p-36">
        <div className="w-full border shadow-md rounded-none overflow-hidden mt-6">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center font-extrabold">Item</TableHead>
                <TableHead className="text-center font-extrabold">Name</TableHead>
                <TableHead className="text-center font-extrabold">Price</TableHead>
                <TableHead className="text-center font-extrabold">Qty</TableHead>
                <TableHead className="text-center font-extrabold">Total</TableHead>
                <TableHead className="text-center font-extrabold">Remove</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cart?.cartItems?.length ? (
                cart.cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      <Image
                        width={60}
                        height={60}
                        src={item.menuItem.image || "/placeholder.png"}
                        alt={item.menuItem.name}
                        className="rounded object-cover"
                      />
                    </TableCell>

                    <TableCell className="text-center">{item.menuItem.name}</TableCell>

                    <TableCell className="text-center">
                      ₹{item.menuItem.price.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.menuItem.id, -1)}
                        >
                          -
                        </Button>

                        <span>{item.quantity}</span>

                        <Button
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.menuItem.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button variant="ghost" className="text-red-500" onClick={() => handleRemoveItem(item.menuItem.id)}>
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Your cart is empty
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between p-8">
            <div className="flex gap-2 w-1/3">
              <Input type="text" placeholder="Coupon code" />
              <Button className="bg-[#eb0029]">Apply</Button>
            </div>

            <div className="flex gap-2 w-1/3">
              <Button className="bg-[#eb0029]" onClick={handleClearCart} disabled={!cart?.cartItems?.length}>
                Clear Cart
              </Button>

              <Button className="bg-[#eb0029]">Continue Shopping</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full mt-20">
          <div className="w-1/2">
            <h1 className="text-gray-500 text-3xl mb-4">Cart Totals</h1>

            <div className="border shadow-xs p-6">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="font-medium">Shipping:</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <Button className="w-full mt-6 bg-[#eb0029]" onClick={handleCheckout} disabled={!cart?.cartItems?.length}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
