import { z } from "zod";
import { Operation, operationSchema } from "../../operation";
import { Vertex, VertexId } from "../../vertex/vertex";
import { baseEffectiveNodeOperationSchema } from "./baseEffective";

const baseCompositeOperationSchema = baseEffectiveNodeOperationSchema.extend({
  isPrimitive: z.literal(false),
  boundVertex: z.number(),
});

type BaseCompositeOperation = z.infer<typeof baseCompositeOperationSchema> & {
  implementation: Operation[];
};

export const compositeOperationSchema: z.ZodType<BaseCompositeOperation> =
  baseCompositeOperationSchema.extend({
    implementation: z.array(z.lazy(() => operationSchema)),
  });

export type CompositeOperation = z.infer<typeof compositeOperationSchema>;

export const getSubOperation = (
  operation: CompositeOperation,
  id: string
): Operation | undefined => {
  let found: Operation | undefined;
  operation.implementation.forEach((op) => {
    if (op.id === id) {
      found = op;
    }
    if (op.isNode && op.isEffective && !op.isPrimitive) {
      const found = getSubOperation(op, id);
      if (found) {
        return found;
      }
    }
  });
  return found;
};

export const getShallowVertex = (
  operation: CompositeOperation,
  vertexId: VertexId
): Vertex | undefined => {
  if (operation.id === vertexId.operationId) {
    return operation.exposedVertices[vertexId.index];
  }
  for (let i = 0; i < operation.implementation.length; i++) {
    const op = operation.implementation[i];
    if (op.id === vertexId.operationId && op.isNode && op.isEffective) {
      return op.exposedVertices[vertexId.index];
    }
  }
  return undefined;
};
