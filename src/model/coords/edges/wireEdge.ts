import { EqualityConstraint } from "../../graph/constraint";
import { Edge } from "../../graph/edge";
import { VertexId } from "../../graph/vertex";
import { Coord } from "../coord/coord";
import { CoordVertex } from "../coordVertex";

export class WireEdge extends Edge<Coord, CoordVertex> {
  // :Edge<LinkagePoint>

  source: VertexId;
  target: VertexId;

  constructor(
    v: CoordVertex[],
    id: string,
    source: VertexId,
    target: VertexId,
    c: EqualityConstraint<Coord>
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
