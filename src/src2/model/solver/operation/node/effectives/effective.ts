import { z } from "zod";
import { Vertex } from "../../vertex/vertex";
import { compositeOperationSchema } from "./composite";
import { primitiveOperationSchema } from "./primitives/primitive";

export const effectiveNodeOperationSchema = z.union([
  primitiveOperationSchema,
  compositeOperationSchema,
]);

export type EffectiveNodeOperation = z.infer<typeof effectiveNodeOperationSchema>;

export const isBound = (vertex: Vertex): boolean => {
  return vertex.deps.length > 0;
};
