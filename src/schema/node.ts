import { z } from "zod";
import { genId } from "./id";

export const NODE_ID_LENGTH = 8;

export const genNodeId = genId(NODE_ID_LENGTH);

export const baseNodeSchema = z.object({
  id: z.string().length(NODE_ID_LENGTH),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

// values
const valueSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const valueNodeSchema = baseNodeSchema.extend({
  type: z.literal("value"),
  data: z.object({
    value: z.object({
      x: z.number(),
      y: z.number(),
    }),
    mode: z.union([z.literal("single"), z.literal("cartesian")]),
  }),
});

// operators

export const carryingSchema = z.union([z.literal("value"), z.literal("list")]);

export const binopSchema = baseNodeSchema.extend({
  type: z.literal("binop"),
  data: z.object({
    carrying: carryingSchema,
    operand1: valueSchema,
    operand2: valueSchema,
    operator: z.union([z.literal("add"), z.literal("mult")]),
    result: valueSchema,
  }),
});

export const unopSchema = baseNodeSchema.extend({
  type: z.literal("unop"),
  data: z.object({
    carrying: carryingSchema,
    operand: valueSchema,
    operator: z.union([z.literal("exp"), z.literal("conj")]),
    result: valueSchema,
  }),
});

// etc.
export const stickySchema = baseNodeSchema.extend({
  type: z.literal("sticky"),
  data: z.object({
    text: z.string(),
  }),
});

export const nodeSchema = z.union([valueNodeSchema, binopSchema, unopSchema, stickySchema]);

export type CircuitNode = z.infer<typeof nodeSchema>;
export type Value = z.infer<typeof valueNodeSchema>;
export type Unop = z.infer<typeof unopSchema>;
export type Binop = z.infer<typeof binopSchema>;
export type Sticky = z.infer<typeof stickySchema>;
