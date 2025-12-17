import { z } from "zod";

export const restaurantStep4Schema = z.object({
  email: z.email(),
  agreement: z.boolean(),
});
