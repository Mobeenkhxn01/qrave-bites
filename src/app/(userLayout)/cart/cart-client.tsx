"use client";

import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CartClient() {
  const searchParams = useSearchParams();
  const tableNumber = Number(searchParams.get("table")) || null;

  const {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart(tableNumber); // ✅ FIXED: passing tableNumber

  const handleQtyChange = (menuItemId: string, change: number) => {
    change > 0 ? addToCart(menuItemId) : removeFromCart(menuItemId);
    toast.success("Cart updated");
  };

  const handleRemoveItem = (menuItemId: string) => {
    removeFromCart(menuItemId);
    toast.success("Item removed");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleCheckout = async () => {
    try {
      if (!tableNumber) {
        toast.error("Table number missing!");
        return;
      }

      const res = await axios.post("/api/checkout", { tableNumber });
      toast.success("Redirecting to payment...");
      window.location.href = res.data.url;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Checkout failed");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading cart...</div>;
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <TitleHeader title="Cart Items" subtitle="Cart" />

      <div className="p-4 md:p-10 lg:p-20">
        {/* ✅ MOBILE VIEW */}
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
                    <p className="text-gray-500">₹{item.menuItem.price}</p>
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
                    onClick={() => handleRemoveItem(item.menuItem.id)}
                  >
                    Remove
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

        {/* ✅ DESKTOP VIEW */}
        <div className="hidden md:block">
          <div className="w-full border shadow-md rounded-lg overflow-hidden mt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center font-bold">
                    Item
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Name
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Price
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Qty
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Total
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Remove
                  </TableHead>
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
                          src={
                            item.menuItem.image || "/placeholder.png"
                          }
                          alt={item.menuItem.name}
                          className="rounded object-cover"
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
                        ₹
                        {(item.menuItem.price * item.quantity).toFixed(
                          2
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          className="text-red-500"
                          onClick={() =>
                            handleRemoveItem(item.menuItem.id)
                          }
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8"
                    >
                      Your cart is empty
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ✅ BOTTOM CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
          <div className="flex gap-2 w-full md:w-1/3">
            <Input placeholder="Coupon code" />
            <Button className="bg-[#eb0029]">Apply</Button>
          </div>

          <div className="flex gap-2 w-full md:w-1/3 justify-end">
            <Button
              className="bg-[#eb0029]"
              onClick={handleClearCart}
              disabled={!cart?.cartItems?.length}
            >
              Clear Cart
            </Button>

            <Button className="bg-gray-800">
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* ✅ TOTAL SECTION */}
        <div className="flex justify-end mt-10">
          <div className="w-full md:w-1/2 lg:w-1/3 border p-6 shadow-md rounded-lg">
            <h1 className="text-gray-600 text-2xl mb-4">
              Cart Totals
            </h1>

            <div className="flex justify-between mb-4">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Shipping:</span>
              <span>Free</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-6 bg-[#eb0029]"
              onClick={handleCheckout}
              disabled={!cart?.cartItems?.length}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
