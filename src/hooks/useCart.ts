import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface CartItem {
  id: string;
  menuItemId: string;
  quantity: number;
  menuItem: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  };
}

interface Cart {
  id: string;
  userId?: string | null;
  tableNumber?: number | null;
  cartItems: CartItem[];
}

export const useCart = (tableNumber: number | null) => {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart", tableNumber],
    queryFn: async () => {
      const url = tableNumber
        ? `/api/cart?table=${tableNumber}`
        : `/api/cart`;

      const res = await axios.get(url);
      return res.data || { cartItems: [] };
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (menuItemId: string) => {
      const url = tableNumber
        ? `/api/cart?table=${tableNumber}`
        : `/api/cart`;

      const res = await axios.post(url, { menuItemId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tableNumber] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (menuItemId: string) => {
      const url = tableNumber
        ? `/api/cart?table=${tableNumber}`
        : `/api/cart`;

      const res = await axios.delete(url, { data: { menuItemId } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tableNumber] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const url = tableNumber
        ? `/api/cart/clear?table=${tableNumber}`
        : `/api/cart/clear`;

      const res = await axios.delete(url);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tableNumber] });
    },
  });

  const totalItems =
    cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const totalPrice =
    cart?.cartItems?.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    ) || 0;

  return {
    cart,
    isLoading,
    addToCart: (menuItemId: string) => addToCartMutation.mutate(menuItemId),
    removeFromCart: (menuItemId: string) =>
      removeFromCartMutation.mutate(menuItemId),
    clearCart: () => clearCartMutation.mutate(),
    totalItems,
    totalPrice,
  };
};
