import { Constraint } from "../../graph/constraint";
import { Edge } from "../../graph/edge";
import { Coord } from "../coord/coord";
import { CoordVertex } from "../coordVertex";

export class CircuitEdge extends Edge<Coord, CoordVertex> {
  selected: boolean;

  constructor(v: CoordVertex[], c: Constraint<Coord>, id: string) {
    super(v, c, id);
    this.selected = false;
  }
}
