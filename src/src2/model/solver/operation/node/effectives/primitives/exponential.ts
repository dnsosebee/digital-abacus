import { z } from "zod";
import { genOperationId } from "../../../operation";
import { Coord } from "../../../vertex/coord";
import { genVertex, vertexSchema } from "../../../vertex/vertex";
import { basePrimitiveOperationSchema } from "./basePrimitive";

export const exponentialSchema = basePrimitiveOperationSchema.extend({
  opType: z.literal("exponential"),
  exposedVertices: z.array(vertexSchema).length(2),
  boundVertex: z.number().min(0).max(1),
});

export type Exponential = z.infer<typeof exponentialSchema>;

export const genExponential = (position: Coord): Exponential => ({
  id: genOperationId(),
  selected: false,
  isNode: true,
  position: position,
  label: "",
  isEffective: true,
  isPrimitive: true,
  exposedVertices: [genVertex(), genVertex()],
  hideLinkages: false,
  opType: "exponential",
  boundVertex: 1,
});
