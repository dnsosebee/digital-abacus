import { stickySchema } from "@/schema/node";
import { z } from "zod";
import { serialNodeEdgeSchema } from "../coords/edges/nodeEdge";
import { serialWireEdgeSchema } from "../coords/edges/wireEdge";
import { serialRelGraphSchema } from "../graph/relGraph";
import { serialVertexIdSchema } from "../graph/vertex";

export const serialSubgraphSchema = serialRelGraphSchema.extend({
  edges: z.array(z.union([serialNodeEdgeSchema, serialWireEdgeSchema])),
});

export const serialCoordGraphSchema = serialSubgraphSchema.extend({
  mode: z.number(),
  focus: z.nullable(serialVertexIdSchema),
  stickies: stickySchema.array(),
});

export type SerialCoordGraph = z.infer<typeof serialCoordGraphSchema>;
export type SerialSubgraph = z.infer<typeof serialSubgraphSchema>;
