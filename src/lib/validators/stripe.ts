import { z } from "zod";

export const stripeCheckoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(3),
  orderId: z.string().min(1),
  tableId: z.string().min(1),
});

export const stripeWebhookMetadataSchema = z.object({
  restaurantId: z.string().min(1),
  tableId: z.string().min(1),
  cartId: z.string().min(1),
});
