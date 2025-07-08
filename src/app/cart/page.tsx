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

export default function Cart() {
  const {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  const queryClient = useQueryClient();

  // Mutation for updating quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ menuItemId, change }: { menuItemId: string; change: number }) => {
      // For incrementing, we can just add the item again (which will increment quantity in backend)
      if (change > 0) {
        await axios.post('/api/cart', { menuItemId });
      } else {
        // For decrementing, we use the remove endpoint
        await axios.delete('/api/cart', { data: { menuItemId } });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const handleUpdateQuantity = (menuItemId: string, change: number) => {
    updateQuantityMutation.mutate({ menuItemId, change });
  };

  const handleRemoveItem = (menuItemId: string) => {
    // Remove all quantities of this item
    const cartItem = cart?.cartItems?.find(item => item.menuItem.id === menuItemId);
    if (cartItem) {
      removeFromCart(menuItemId);
    }
  };

  const handleClearCart = async () => {
    if (!cart?.id) return;
    
    try {
      await axios.delete(`/api/cart/clear`, {
        data: { cartId: cart.id }
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  if (isLoading) return <div>Loading cart...</div>;

  return (
    <div className="flex flex-col w-full bg-white">
      <TitleHeader title="Cart Items" subtitle="Cart" />
      <div className="p-36">
        <div className="w-full border shadow-md rounded-none overflow-hidden mt-6">
          <Table className="min-w-full ">
            <TableHeader>
              <TableRow className="bg-gray-100 ">
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Item Image
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Item Name
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Price
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Quantity
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Total
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Remove
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart?.cartItems?.length ? (
                cart.cartItems.map((item) => (
                  <TableRow key={item.id} className=" cursor-pointer">
                    <TableCell className="px-4 py-8 flex justify-center items-center">
                      <Image
                        width={60}
                        height={60}
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="px-4 py-8 text-center">
                      {item.menuItem.name}
                    </TableCell>
                    <TableCell className="px-4 py-8 text-center">
                      ${item.menuItem.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.menuItem.id, -1)}
                          className="px-2 py-1"
                          disabled={updateQuantityMutation.isPending}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.menuItem.id, 1)}
                          className="px-2 py-1"
                          disabled={updateQuantityMutation.isPending}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-8 text-center">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-4 py-8 text-center">
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.menuItem.id)}
                        className="text-red-500"
                        disabled={updateQuantityMutation.isPending}
                      >
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

          <div className="flex items-center flex-row justify-between p-8">
            <div className="flex items-center flex-row justify-center gap-2 w-1/3">
              <Input
                type="text"
                placeholder="Coupon code"
                className="rounded-none p-6"
                id="coupon"
              />
              <Button className="ml-2 bg-[#eb0029] rounded-none p-6">
                Apply
              </Button>
            </div>

            <div className="flex items-center flex-row justify-center gap-2 w-1/3">
              <Button 
                className="ml-2 bg-[#eb0029] rounded-none p-6"
                onClick={handleClearCart}
                disabled={!cart?.cartItems?.length}
              >
                Clear Cart
              </Button>
              <Button className="ml-2 bg-[#eb0029] rounded-none p-6">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full mt-20">
          <div className="w-1/2"></div>
          <div className="w-1/2 ">
            <h1 className="text-gray-500 text-3xl mb-4">Cart Totals</h1>
            <div className="border shadow-xs rounded-none overflow-hidden p-6">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium">Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-6 bg-[#eb0029] rounded-none p-6">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}