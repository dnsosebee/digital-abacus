import { z } from "zod";
import { EqualityConstraint } from "../../graph/constraint";
import { VertexId, serialVertexIdSchema } from "../../graph/vertex";
import { DifferentialCoord } from "../coord/differentialCoord";
import { CoordVertex } from "../coordVertex";
import { IterativeComplexEqualityConstraint } from "../operations/iterative";
import { CircuitEdge, serialCircuitEdgeSchema } from "./circuitEdge";

export const serialWireEdgeSchema = serialCircuitEdgeSchema.extend({
  source: serialVertexIdSchema,
  target: serialVertexIdSchema,
  primaryLeft: z.boolean(),
});

export type SerialWireEdge = z.infer<typeof serialWireEdgeSchema>;

export class WireEdge extends CircuitEdge {
  // :Edge<LinkagePoint>

  source: VertexId;
  target: VertexId;

  constructor(
    v: CoordVertex[],
    id: string,
    source: VertexId,
    target: VertexId,
    c: EqualityConstraint<DifferentialCoord>,
    selected = false
  ) {
    super(v, c, id, selected);
    this.source = source;
    this.target = target;
  }

  serialize(): SerialWireEdge {
    const serialized = super.serialize();
    return {
      ...serialized,
      source: this.source,
      target: this.target,
      primaryLeft: (this.constraint as IterativeComplexEqualityConstraint).primaryLeft,
    };
  }

  invert(take: number, give: number) {
    // :index(this.vertices) -> index(this.vertices) -> bool
    if (this.constraint.invert(take, give)) {
      const prevSource = this.source;
      this.source = this.target;
      this.target = prevSource;
      this.updateDependencies();
      return true;
    } else {
      return false;
    }
  }
}
