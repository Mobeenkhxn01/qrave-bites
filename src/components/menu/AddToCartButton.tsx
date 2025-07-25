'use client'

import { useCartContext } from '@/context/CardContext'
import { Button } from '@/components/ui/button'

export function AddToCartButton({ menuItemId }: { menuItemId: string }) {
  const { addToCart, cart } = useCartContext()

  const itemInCart = cart?.cartItems?.find(item => item.menuItem.id === menuItemId)
  const quantity = itemInCart?.quantity || 0

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => addToCart(menuItemId)}
        className="w-full"
      >
        Add to Cart {quantity > 0 && `(${quantity})`}
      </Button>
    </div>
  )
}