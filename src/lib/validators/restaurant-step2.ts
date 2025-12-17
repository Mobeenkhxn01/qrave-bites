import { z } from "zod";

export const restaurantStep2Schema = z.object({
  email: z.email(),
  cuisine: z.array(z.string()).min(1),
  restaurantImageUrl: z.string().min(1),
  foodImageUrl: z.string().min(1),
  deliveryImageUrl: z.string().min(1),
  restaurantProfileUrl: z.string().min(1),
  days: z.array(z.string()).min(1),
  openingTime: z.string().min(1),
  closingTime: z.string().min(1),
});

export const restaurantStep2QuerySchema = z.object({
  email: z.email(),
});
