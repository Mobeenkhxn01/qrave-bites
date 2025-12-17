import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  prepTime: z.number().int().nonnegative(),
  available: z.boolean(),
});

export const updateMenuItemSchema = createMenuItemSchema.extend({
  id: z.string().min(1),
});

export const menuItemQuerySchema = z.object({
  userId: z.string().min(1),
});

export const menuItemDeleteSchema = z.object({
  id: z.string().min(1),
});

export const menuItemIdQuerySchema = z.object({
  id: z.string().min(1),
});
