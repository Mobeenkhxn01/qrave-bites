import { z } from "zod";

export const cartQuerySchema = z.object({
  tableId: z.string().optional(),
});

export const cartItemSchema = z.object({
  menuItemId: z.string().min(1),
});
export const cartClearQuerySchema = z.object({
  tableId: z.string().optional(),
});
