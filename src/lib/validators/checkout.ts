import { z } from "zod";

export const checkoutSchema = z.object({
  cartId: z.string().min(1),
  restaurantId: z.string().min(1),
  tableId: z.string().nullable().optional(),
});
