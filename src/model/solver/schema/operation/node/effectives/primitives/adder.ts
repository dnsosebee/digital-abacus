import { z } from "zod";
import { genOperationId } from "../../../operation";
import { Coord } from "../../../vertex/coord";
import { genVertex, vertexSchema } from "../../../vertex/vertex";
import { basePrimitiveOperationSchema } from "./basePrimitive";

export const adderSchema = basePrimitiveOperationSchema.extend({
  opType: z.literal("adder"),
  exposedVertices: z.array(vertexSchema).length(3),
  boundVertex: z.number().min(0).max(2),
});

export type Adder = z.infer<typeof adderSchema>;

export const genAdder = (position: Coord): Adder => ({
  id: genOperationId(),
  selected: false,
  isNode: true,
  position: position,
  label: "",
  isEffective: true,
  isPrimitive: true,
  exposedVertices: [genVertex(), genVertex(), genVertex()],
  hideLinkages: false,
  opType: "adder",
  boundVertex: 2,
});
