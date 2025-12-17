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
  tableId?: string | null;
  cartItems: CartItem[];
}

export const useCart = (tableId: string | null) => {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart", tableId],
    queryFn: async () => {
      const url = tableId
        ? `/api/cart?tableId=${tableId}`
        : `/api/cart`;

      const res = await axios.get(url);
      return res.data || { cartItems: [] };
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      menuItemId,
      tableId,
    }: {
      menuItemId: string;
      tableId: string | null;
    }) => {
      const url = tableId
        ? `/api/cart?tableId=${tableId}`
        : `/api/cart`;

      const res = await axios.post(url, { menuItemId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tableId] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({
      menuItemId,
      tableId,
    }: {
      menuItemId: string;
      tableId: string | null;
    }) => {
      const url = tableId
        ? `/api/cart?tableId=${tableId}`
        : `/api/cart`;

      const res = await axios.delete(url, { data: { menuItemId } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tableId] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async (tableId: string | null) => {
      const url = tableId
        ? `/api/cart/clear?tableId=${tableId}`
        : `/api/cart/clear`;

      const res = await axios.delete(url);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tableId] });
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
    addToCart: (menuItemId: string, tableId: string | null) =>
      addToCartMutation.mutate({ menuItemId, tableId }),
    removeFromCart: (menuItemId: string, tableId: string | null) =>
      removeFromCartMutation.mutate({ menuItemId, tableId }),
    clearCart: (tableId: string | null) =>
      clearCartMutation.mutate(tableId),
    totalItems,
    totalPrice,
  };
};
