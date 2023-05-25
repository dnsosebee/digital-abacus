import { z } from "zod";
import { NODE_ID_LENGTH, genId } from "./id";

export const WIRE_ID_LENGTH = 8;

export const genWireId = genId(WIRE_ID_LENGTH);

const handleSchema = z.string();

// z.union([
//   z.literal("operand"), // for unops
//   z.literal("operand1"), // for binops
//   z.literal("operand2"), // for binops
//   z.literal("valSource"), // for values
//   z.literal("valTarget"), // for values
//   z.literal("result"),
// ]);

export const wireSchema = z.object({
  id: z.string().length(WIRE_ID_LENGTH),
  type: z.union([z.literal("coord"), z.literal("list")]),
  source: z.string().length(NODE_ID_LENGTH),
  sourceHandle: handleSchema,
  target: z.string().length(NODE_ID_LENGTH),
  targetHandle: handleSchema,
  animated: z.literal(true),
  selected: z.boolean(),
});

export type Wire = z.infer<typeof wireSchema>;
