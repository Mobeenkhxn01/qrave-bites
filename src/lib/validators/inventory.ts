import { z } from "zod";

export const inventoryQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const inventoryCreateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  currentStock: z.number().optional(),
  minStock: z.number().optional(),
  maxStock: z.number().optional(),
  unit: z.string().optional(),
  cost: z.number().optional(),
  supplier: z.string().optional(),
});

export const inventoryIdParamSchema = z.object({
  id: z.string().min(1),
});

export const inventoryUpdateSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  currentStock: z.number().optional(),
  minStock: z.number().optional(),
  maxStock: z.number().optional(),
  unit: z.string().optional(),
  cost: z.number().optional(),
  supplier: z.string().optional(),
});
