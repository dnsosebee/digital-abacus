import { OpType } from "@/model/coords/edges/nodeEdge";
import { effectiveNodeOperationSchema } from "@/src2/model/solver/operation/node/effectives/effective";
import { z } from "zod";
import { genId } from "./id";

export const NODE_ID_LENGTH = 8;

export const genNodeId = genId(NODE_ID_LENGTH);

const baseNodeSchema = z.object({
  id: z.string().length(NODE_ID_LENGTH),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  selected: z.boolean(),
});

const mathSchema = baseNodeSchema.extend({
  type: z.literal("math"),
  data: z.object({
    operation: effectiveNodeOperationSchema,
  }),
});

export const stickySchema = baseNodeSchema.extend({
  type: z.literal("sticky"),
  data: z.object({
    text: z.string(),
  }),
});

export const nodeSchema = z.union([mathSchema, stickySchema]);

export type Math = z.infer<typeof mathSchema>;
export type Sticky = z.infer<typeof stickySchema>;

// export type Popup = {
//   id: "popup";
//   for: string;
//   position: { x: number; y: number };
//   type: "popup";
//   selectable: false;
//   deletable: false;
//   draggable: false;
// };
export type CircuitNode = Math | Sticky;

export type AddNode = { position: { x: number; y: number } } & (
  | { type: "sticky" }
  | { type: "math"; data: { opType: OpType } }
);
