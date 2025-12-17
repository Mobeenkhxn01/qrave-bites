import { z } from "zod";

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
  paid: z.boolean().optional(),
});
export const orderIdParamSchema = z.object({
  id: z.string().min(1),
});
