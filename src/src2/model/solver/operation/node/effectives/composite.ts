import { z } from "zod";
import { Operation, operationSchema } from "../../operation";
import { baseEffectiveNodeOperationSchema } from "./baseEffective";

const baseCompositeOperationSchema = baseEffectiveNodeOperationSchema.extend({
  isPrimitive: z.literal(false),
  boundVertices: z.array(z.number()),
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
