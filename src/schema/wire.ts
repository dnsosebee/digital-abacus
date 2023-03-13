import { z } from "zod";
import { genId } from "./id";
import { carryingSchema, NODE_ID_LENGTH } from "./node";

export const WIRE_ID_LENGTH = 8;

export const genWireId = genId(WIRE_ID_LENGTH);

const handleSchema = z.union([
  z.literal("operand"), // for unops
  z.literal("operand1"), // for binops
  z.literal("operand2"), // for binops
  z.literal("valSource"), // for values
  z.literal("valTarget"), // for values
  z.literal("result"),
]);

export const wireSchema = z.object({
  id: z.string().length(WIRE_ID_LENGTH),
  type: carryingSchema,
  source: z.string().length(NODE_ID_LENGTH),
  sourceHandle: handleSchema,
  target: z.string().length(NODE_ID_LENGTH),
  targetHandle: handleSchema,
});

export type Wire = z.infer<typeof wireSchema>;
