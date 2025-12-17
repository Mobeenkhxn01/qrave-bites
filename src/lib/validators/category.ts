import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  userId: z.string().min(1),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const categoryQuerySchema = z.object({
  userId: z.string().min(1),
});

export const categoryDeleteSchema = z.object({
  id: z.string().min(1),
});
export const categoryIdQuerySchema = z.object({
  id: z.string().min(1),
});