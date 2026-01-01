"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import TitleHeader from "@/components/layout/TitleHeader";
import { useCart } from "@/hooks/useCart";

export default function CartClient() {
  const searchParams = useSearchParams();

  const tableId = searchParams.get("tableId");
  const tableNumber = Number(searchParams.get("table")) || null;

  const [phone, setPhone] = useState("");

  const {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart(tableId);

  const handleQtyChange = (menuItemId: string, change: number) => {
    change > 0
      ? addToCart(menuItemId, tableId)
      : removeFromCart(menuItemId, tableId);
  };

  const handleCheckout = async () => {
    if (!tableId || !tableNumber) {
      toast.error("Table not detected");
      return;
    }

    if (!phone || phone.length < 8) {
      toast.error("Enter valid phone number");
      return;
    }

    try {
      const res = await axios.post("/api/checkout", {
        tableId,
        tableNumber,
        phone,
      });

      window.location.href = res.data.url;
    } catch (err: unknown) {
      toast.error("Checkout failed");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading cart...</div>;
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <TitleHeader title="Cart Items" subtitle="Cart" />

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {cart?.cartItems?.length ? (
              cart.cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.menuItem.image || "/placeholder.png"}
                      width={50}
                      height={50}
                      alt={item.menuItem.name}
                    />
                  </TableCell>

                  <TableCell>{item.menuItem.name}</TableCell>

                  <TableCell>₹{item.menuItem.price}</TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleQtyChange(item.menuItem.id, -1)
                        }
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleQtyChange(item.menuItem.id, 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Cart is empty
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="max-w-md ml-auto mt-6 space-y-4">
          <Input
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          <Button className="w-full bg-[#eb0029]" onClick={handleCheckout}>
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
