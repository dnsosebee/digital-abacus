import { opTypeSchema } from "@/model/coords/edges/nodeEdge";
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
});

const vertexSchema = z.object({
  bound: z.boolean(),
  coord: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

const mathSchema = baseNodeSchema.extend({
  type: z.literal("math"),
  data: z.object({
    cartesian: z.boolean(),
    vertices: z.array(vertexSchema),
    opType: opTypeSchema,
  }),
});
// etc.
export const stickySchema = baseNodeSchema.extend({
  type: z.literal("sticky"),
  data: z.object({
    text: z.string(),
  }),
});

export const nodeSchema = z.union([mathSchema, stickySchema]);

export type VertexInfo = z.infer<typeof vertexSchema>;
export type CircuitNode = z.infer<typeof nodeSchema>;
export type Math = z.infer<typeof mathSchema>;
export type Sticky = z.infer<typeof stickySchema>;
