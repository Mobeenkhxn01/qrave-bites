"use client";

import React, { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");

  const cart = useCart(tableId);

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
}
