import { z } from "zod";
import { Vertex } from "../../vertex/vertex";
import { compositeOperationSchema } from "./composite";
import { primitiveOperationSchema } from "./primitives/primitive";

export const effectiveOperationSchema = z.union([
  primitiveOperationSchema,
  compositeOperationSchema,
]);

export type EffectiveOperation = z.infer<typeof effectiveOperationSchema>;

export const isBound = (vertex: Vertex): boolean => {
  return vertex.deps.length > 0;
};
