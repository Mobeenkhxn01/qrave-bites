"use client";

import React from "react";
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
  } = useCart();

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
          <div className="p-2 space-y-6">
            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">
              {cart?.cartItems?.length ? (
                cart.cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex gap-4">
                      <Image
                        src={item.menuItem.image || "/placeholder.png"}
                        alt={item.menuItem.name}
                        width={80}
                        height={80}
                        className="rounded"
                      />

                      <div>
                        <p className="font-semibold">{item.menuItem.name}</p>
                        <p className="text-gray-500">
                          ₹{item.menuItem.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleQtyChange(item.menuItem.id, -1)
                          }
                        >
                          -
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleQtyChange(item.menuItem.id, 1)
                          }
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => removeFromCart(item.menuItem.id)}
                      >
                        <Trash />
                      </Button>
                    </div>

                    <p className="text-right font-semibold">
                      Total: ₹
                      {(item.menuItem.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-10">Your cart is empty</p>
              )}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-center">Item</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Remove</TableHead>
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
                            className="rounded"
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          {item.menuItem.name}
                        </TableCell>

                        <TableCell className="text-center">
                          ₹{item.menuItem.price}
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-2">
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

                        <TableCell className="text-center">
                          ₹{item.menuItem.price * item.quantity}
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            className="text-red-500"
                            onClick={() =>
                              removeFromCart(item.menuItem.id)
                            }
                          >
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Cart is empty
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* TOTAL SECTION */}
            <div className="border p-4 rounded-lg shadow-sm space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <Button
                className="w-full bg-[#eb0029]"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
