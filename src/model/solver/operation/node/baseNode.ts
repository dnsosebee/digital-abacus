import { z } from "zod";
import { baseOperationSchema } from "../baseOperation";
import { genOperationId } from "../operation";
import { Coord, coordSchema } from "../vertex/coord";

export const baseNodeOperationSchema = baseOperationSchema.extend({
  isNode: z.literal(true),
  position: coordSchema,
  label: z.string(),
});

export type BaseNodeOperation = z.infer<typeof baseNodeOperationSchema>;

export const genBaseNodeOperation = (position: Coord): BaseNodeOperation => ({
  id: genOperationId(),
  selected: false,
  isNode: true,
  position: position,
  label: "",
});
