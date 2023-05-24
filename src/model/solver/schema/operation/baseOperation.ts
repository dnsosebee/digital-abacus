import { z } from "zod";

export const baseOperationSchema = z.object({
  id: z.string(),
  selected: z.boolean(),
});
