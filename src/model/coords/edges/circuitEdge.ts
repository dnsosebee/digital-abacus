import { z } from "zod";
import { Constraint } from "../../graph/constraint";
import { Edge, SerialEdge, serialEdgeSchema } from "../../graph/edge";
import { DifferentialCoord } from "../coord/differentialCoord";
import { CoordVertex, SerialCoordVertex, serialCoordVertexSchema } from "../coordVertex";

export const serialCircuitEdgeSchema = serialEdgeSchema.extend({
  vertices: z.array(serialCoordVertexSchema),
  selected: z.boolean(),
});

export type SerialCircuitEdge = z.infer<typeof serialCircuitEdgeSchema>;

export class CircuitEdge extends Edge<DifferentialCoord, CoordVertex> {
  selected: boolean;

  constructor(v: CoordVertex[], c: Constraint<DifferentialCoord>, id: string, selected = false) {
    super(v, c, id);
    this.selected = selected;
  }

  serialize(): SerialCircuitEdge {
    const serialized = super.serialize() as SerialEdge & { vertices: SerialCoordVertex[] };
    return { ...serialized, selected: this.selected };
  }
}
