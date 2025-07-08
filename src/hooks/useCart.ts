import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import axios from 'axios'

interface CartItem {
  id: string
  menuItemId: string
  quantity: number
  menuItem: {
    id: string
    name: string
    price: number
    description: string
    image: string
  }
}

interface Cart {
  id: string
  userId: string
  cartItems: CartItem[]
}

export const useCart = () => {
  //const queryClient = useQueryClient()
  const queryClient=useQueryClient();
  // Fetch cart data
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await axios.get('/api/cart')
      return response.data || { cartItems: [] }
    }
  })

  // Add to cart mutation
  const addToCart = useMutation({
    mutationFn: async (menuItemId: string) => {
      const response = await axios.post('/api/cart', { menuItemId })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })

  // Remove from cart mutation
  const removeFromCart = useMutation({
    mutationFn: async (menuItemId: string) => {
      const response = await axios.delete('/api/cart', { data: { menuItemId } })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
  const clearCart = useMutation({
  mutationFn: async (cartId: string) => {
    const response = await axios.delete('/api/cart', { data: { cartId } })
    return response.data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }
})


  const totalItems = cart?.cartItems?.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0

  // Calculate total price
  const totalPrice = cart?.cartItems?.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  ) || 0

  return {
    cart,
    isLoading,
    addToCart: addToCart.mutate,
    removeFromCart: removeFromCart.mutate,
    totalItems,
    totalPrice,
    clearCart: clearCart.mutate
  }
}