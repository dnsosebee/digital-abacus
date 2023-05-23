import { z } from "zod";
import { Coord, coordSchema } from "./coord";

export const vertexIdSchema = z.object({
  operationId: z.string(),
  index: z.number(),
});

export const depSchema = z.object({
  vertexId: vertexIdSchema,
  bindingOperation: z.string(),
});

export type Dep = z.infer<typeof depSchema>;

export const vertexSchema = z.object({
  value: coordSchema,
  differential: coordSchema.nullable(),
  selected: z.boolean(),
  deps: z.array(depSchema), // DEPS ARE RELATIVE TO ENCLOSING COMPOSITE ONLY, NOT TO ANY SUBGRAPH/IMPLEMENTATION
});
export function vertexIdEq(v1: VertexId, v2: VertexId) {
  return v1.operationId == v2.operationId && v1.index == v2.index;
}

export type Vertex = z.infer<typeof vertexSchema>;
export type VertexId = z.infer<typeof vertexIdSchema>;

export const genVertex = (value?: Coord): Vertex => ({
  value: value ?? { x: 0, y: 0 },
  differential: { x: 0, y: 0 },
  selected: false,
  deps: [],
});
