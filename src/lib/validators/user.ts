import { z } from "zod";

export const updateUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional().nullable(),
  streetAddress: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
});
