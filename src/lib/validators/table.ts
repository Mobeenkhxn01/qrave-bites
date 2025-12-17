import { z } from "zod";

export const createTableSchema = z.object({
  number: z.number().int().positive(),
});
