import { Constraint } from "../../graph/constraint";
import { Edge } from "../../graph/edge";
import { DifferentialCoord } from "../coord/differentialCoord";
import { CoordVertex } from "../coordVertex";

export class CircuitEdge extends Edge<DifferentialCoord, CoordVertex> {
  selected: boolean;

  constructor(v: CoordVertex[], c: Constraint<DifferentialCoord>, id: string) {
    super(v, c, id);
    this.selected = false;
  }
}
