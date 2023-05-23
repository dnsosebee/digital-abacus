import { z } from "zod";

export const coordSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Coord = z.infer<typeof coordSchema>;
