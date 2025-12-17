import { z } from "zod";

export const createOrderSchema = z.object({
  cartId: z.string().min(1),
  restaurantId: z.string().min(1),
  tableId: z.string().nullable().optional(),
  phone: z.string().optional(),
});
export const orderQuerySchema = z.object({
  _id: z.string().optional(),
});