import { z } from "zod";

export const restaurantStep3Schema = z.object({
  email: z.email(),
  panNumber: z.string().min(1),
  fullName: z.string().min(1),
  restaurantAddress: z.string().min(1),
  panImage: z.string().optional().nullable(),
  accountNumber: z.string().min(1),
  ifscCode: z.string().min(1),
  accountType: z.enum(["SAVINGS", "CURRENT"]),
  upiId: z.string().optional().nullable(),
});

export const restaurantStep3QuerySchema = z.object({
  email: z.email(),
});
