"use client";
import React, { useState } from "react";
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

const initialCartItems = [
  {
    id: 1,
    image: "/product.image",
    name: "Protein Shake",
    price: 250.0,
    quantity: 1,
  },
  {
    id: 2,
    image: "/product.image",
    name: "Veggies",
    price: 50.0,
    quantity: 1,
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (itemId: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity + change > 0
          ? { ...item, quantity: item.quantity + change }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // const calculateTotal = () =>
  //   cartItems
  //     .reduce((total, item) => total + item.price * item.quantity, 0)
  //     .toFixed(2);

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
              {cartItems.map((item) => (
                <TableRow key={item.id} className=" cursor-pointer">
                  <TableCell className="px-4 py-8 flex justify-center items-center">
                    <Image
                      width={60}
                      height={60}
                      src={item.image}
                      alt={item.name}
                      className="object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1"
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1"
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500"
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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

            <div className="flex items-center flex-row justify-center gap-2  w-1/3">
              <Button className="ml-2 bg-[#eb0029] rounded-none p-6">
                Clear Cart
              </Button>
              <Button className="ml-2 bg-[#eb0029] rounded-none p-6">
                Continue Shopping
              </Button>{" "}
            </div>
          </div>
        </div>

      <div className="flex flex-row w-full mt-20">
        <div className="w-1/2"></div>
        <div className="w-1/2 ">
            <h1 className="text-gray-500  text-3xl mb-4">Card Totals</h1>
            <div className="border h-40 shadow-xs rounded-none overflow-hidden">
                
            </div>
        </div>
       </div>

      </div>


       
      

    </div>
  );
}
