// components/CartIcon.tsx
'use client'

import { useCartContext } from '@/context/CardContext'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export function CartIcon() {
  const { totalItems } = useCartContext()

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  )
}