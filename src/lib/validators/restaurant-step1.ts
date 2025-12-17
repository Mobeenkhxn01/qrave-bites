import { z } from "zod";

export const restaurantStep1Schema = z.object({
  restaurantname: z.string().min(1),
  ownername: z.string().min(1),
  email: z.email(),
  phone: z.string().min(5),
  mobile: z.boolean().optional(),
  shop: z.number(),
  floor: z.string().optional().nullable(),
  area: z.string().min(1),
  city: z.string().min(1),
  landmark: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const restaurantByEmailSchema = z.object({
  email: z.email(),
});
