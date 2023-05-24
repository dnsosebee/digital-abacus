import { z } from "zod";
import { Coord } from "../vertex/coord";
import { baseNodeOperationSchema, genBaseNodeOperation } from "./baseNode";

export const stickySchema = baseNodeOperationSchema.extend({
  isEffective: z.literal(false),
});

export type Sticky = z.infer<typeof stickySchema>;

export const genSticky = (position: Coord): Sticky => ({
  ...genBaseNodeOperation(position),
  isEffective: false,
});
