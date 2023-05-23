import { z } from "zod";
import { Coord } from "../../../vertex/coord";
import { baseEffectiveNodeOperationSchema, genBaseEffectiveNodeOperation } from "../baseEffective";

// export const OP_TYPE = {
//   ADDER: "adder" as const,
//   MULTIPLIER: "multiplier" as const,
//   CONJUGATOR: "conjugator" as const,
//   EXPONENTIAL: "exponential" as const,
//   STANDALONE: "standalone" as const,
// };

// export const opTypeSchema = z.union([
//   z.literal(OP_TYPE.ADDER),
//   z.literal(OP_TYPE.MULTIPLIER),
//   z.literal(OP_TYPE.CONJUGATOR),
//   z.literal(OP_TYPE.EXPONENTIAL),
//   z.literal(OP_TYPE.STANDALONE),
// ]);

export const basePrimitiveOperationSchema = baseEffectiveNodeOperationSchema.extend({
  isPrimitive: z.literal(true),
  boundVertex: z.number(),
});

export type BasePrimitiveOperation = z.infer<typeof basePrimitiveOperationSchema>;

export const genBasePrimitiveOperation = (position: Coord): BasePrimitiveOperation => ({
  ...genBaseEffectiveNodeOperation(position),
  isPrimitive: true,
  boundVertex: 0,
});
