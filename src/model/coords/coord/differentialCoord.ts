import { Coord } from "./coord";

export class DifferentialCoord extends Coord {
  delta: Coord;

  constructor(x: number, y: number, delta = new Coord(0, 0)) {
    // position of point
    super(x, y);

    this.delta = delta;
  }

  copy() {
    return new DifferentialCoord(this.x, this.y, this.delta.copy());
  }

  mut_applyDifferential(delta: Coord) {
    this.mut_translate(this.delta.multiply(delta));
  }

  equals(other: Coord) {
    return (
      super.equals(other) && other instanceof DifferentialCoord && this.delta.equals(other.delta)
    );
  }
}
