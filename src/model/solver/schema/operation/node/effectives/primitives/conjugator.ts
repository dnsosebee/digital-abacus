import { z } from "zod";
import { genOperationId } from "../../../operation";
import { Coord } from "../../../vertex/coord";
import { genVertex, vertexSchema } from "../../../vertex/vertex";
import { basePrimitiveOperationSchema } from "./basePrimitive";

export const conjugatorSchema = basePrimitiveOperationSchema.extend({
  opType: z.literal("conjugator"),
  exposedVertices: z.array(vertexSchema).length(2),
  boundVertex: z.number().min(0).max(1),
});

export type Conjugator = z.infer<typeof conjugatorSchema>;

export const genConjugator = (position: Coord): Conjugator => ({
  id: genOperationId(),
  selected: false,
  isNode: true,
  position: position,
  label: "",
  isEffective: true,
  isPrimitive: true,
  exposedVertices: [genVertex(), genVertex()],
  hideLinkages: false,
  opType: "conjugator",
  boundVertex: 1,
});
