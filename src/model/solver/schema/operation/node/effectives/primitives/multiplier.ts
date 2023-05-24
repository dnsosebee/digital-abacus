import { z } from "zod";
import { genOperationId } from "../../../operation";
import { Coord } from "../../../vertex/coord";
import { genVertex, vertexSchema } from "../../../vertex/vertex";
import { basePrimitiveOperationSchema } from "./basePrimitive";

export const multiplierSchema = basePrimitiveOperationSchema.extend({
  opType: z.literal("multiplier"),
  exposedVertices: z.array(vertexSchema).length(3),
  boundVertex: z.number().min(0).max(2),
});

export type Multiplier = z.infer<typeof multiplierSchema>;

export const genMultiplier = (position: Coord): Multiplier => ({
  id: genOperationId(),
  selected: false,
  isNode: true,
  position: position,
  label: "",
  isEffective: true,
  isPrimitive: true,
  exposedVertices: [
    genVertex({ x: 1, y: 0 }),
    genVertex({ x: 0, y: 0 }),
    genVertex({ x: 0, y: 0 }),
  ],
  hideLinkages: false,
  opType: "multiplier",
  boundVertex: 2,
});
