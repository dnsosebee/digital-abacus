import { z } from "zod";
import { genOperationId } from "../../../operation";
import { Coord } from "../../../vertex/coord";
import { genVertex, vertexSchema } from "../../../vertex/vertex";
import { basePrimitiveOperationSchema } from "./basePrimitive";

export const standaloneSchema = basePrimitiveOperationSchema.extend({
  opType: z.literal("standalone"),
  exposedVertices: z.array(vertexSchema).length(1),
  boundVertex: z.literal(0),
});

export type Standalone = z.infer<typeof standaloneSchema>;

export const genStandalone = (position: Coord): Standalone => ({
  id: genOperationId(),
  selected: false,
  isNode: true,
  position: position,
  label: "",
  isEffective: true,
  isPrimitive: true,
  exposedVertices: [genVertex()],
  hideLinkages: false,
  opType: "standalone",
  boundVertex: 0,
});
