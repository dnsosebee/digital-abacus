import { EqualityConstraint } from "../constraint";
import { Edge } from "../graph/edge";
import { Vertex, VertexId } from "../graph/vertex";
import { LinkagePoint } from "./linkagepoint";

export class WireEdge extends Edge<LinkagePoint> {
  // :Edge<LinkagePoint>

  source: VertexId;
  target: VertexId;

  constructor(
    v: Vertex<LinkagePoint>[],
    id: string,
    source: VertexId,
    target: VertexId,
    c: EqualityConstraint<LinkagePoint>
  ) {
    super(v, c, id);
    this.source = source;
    this.target = target;
  }
}
