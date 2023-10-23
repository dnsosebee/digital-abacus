import { CoordVertex } from "@/model/coords/coordVertex";
import {
  NodeEdge,
  OpType,
  PrimitiveOpType,
  SerialNodeEdge,
  primitiveOpTypeSchema,
} from "@/model/coords/edges/nodeEdge";
import { BuiltinComposite } from "@/model/coords/operations/composites/compositeOperation";
import { z } from "zod";
import { NODE_ID_LENGTH, genId } from "./id";

export const genNodeId = genId(NODE_ID_LENGTH);

const baseNodeSchema = z.object({
  id: z.string().length(NODE_ID_LENGTH),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

// const vertexSchema = z.object({
//   bound: z.boolean(),
//   coord: z.object({
//     x: z.number(),
//     y: z.number(),
//   }),
// });

const mathSchema = baseNodeSchema.extend({
  type: z.literal("math"),
  data: z.object({
    cartesian: z.boolean(),
    vertices: z.array(z.any()),
    opType: primitiveOpTypeSchema,
    label: z.string(),
  }),
});
// etc.
export const stickySchema = baseNodeSchema.extend({
  type: z.literal("sticky"),
  selected: z.boolean(),
  data: z.object({
    text: z.string(),
  }),
});

export const nodeSchema = z.union([mathSchema, stickySchema]);

// export type VertexInfo = z.infer<typeof vertexSchema>;

export const PARENT_NODE_ID = "interface";

export type ParentNode = {
  id: typeof PARENT_NODE_ID,
  position: { x: number; y: number };
  type: "interface";
  selected: false,
  data: {};
}

export type Math = {
  id: string;
  position: { x: number; y: number };
  type: "math";
  selected: boolean;
  parent: typeof PARENT_NODE_ID,
  data: {
    cartesian: boolean;
    vertices: CoordVertex[];
    opType: OpType;
    label: string;
    edge: NodeEdge;
  };
};
export type Sticky = z.infer<typeof stickySchema>;

export type CircuitNode = Math | Sticky | ParentNode;

export type AddNode = { position: { x: number; y: number } } & (
  | { type: "sticky" }
  | { type: "math"; data: { opType: PrimitiveOpType } }
  | { type: "built in composite"; data: { opType: BuiltinComposite } }
  | { type: "user defined composite"; data: { serialEdge: SerialNodeEdge } }
);
