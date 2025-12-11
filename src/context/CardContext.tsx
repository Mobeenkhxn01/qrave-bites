"use client";

import React, { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";

// ✅ Correct context type
type CartContextType = ReturnType<typeof useCart>;

// ✅ Create context
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ✅ Read tableNumber only here (client-safe)
  const searchParams = useSearchParams();
  const tableNumber = Number(searchParams.get("table")) || null;

  // ✅ Pass tableNumber to useCart (FIXES YOUR ERROR)
  const cart = useCart(tableNumber);

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
