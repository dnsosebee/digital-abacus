import { EqualityConstraint } from "../../graph/constraint";
import { VertexId } from "../../graph/vertex";
import { DifferentialCoord } from "../coord/differentialCoord";
import { CoordVertex } from "../coordVertex";
import { CircuitEdge } from "./circuitEdge";

export class WireEdge extends CircuitEdge {
  // :Edge<LinkagePoint>

  source: VertexId;
  target: VertexId;

  constructor(
    v: CoordVertex[],
    id: string,
    source: VertexId,
    target: VertexId,
    c: EqualityConstraint<DifferentialCoord>
  ) {
    super(v, c, id);
    this.source = source;
    this.target = target;
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
