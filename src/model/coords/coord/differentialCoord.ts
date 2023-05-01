import { z } from "zod";
import { Coord, serialCoordSchema } from "./coord";

export const serialDifferentialCoordSchema = serialCoordSchema.extend({
  delta: serialCoordSchema.nullable(),
});

export type SerialDifferentialCoord = z.infer<typeof serialDifferentialCoordSchema>;

export class DifferentialCoord extends Coord {
  delta: Coord | null;

  constructor(x: number, y: number, delta: Coord | null = new Coord(0, 0)) {
    // position of point
    super(x, y);

    this.delta = delta;
  }

  serialize(): SerialDifferentialCoord {
    const serialized = super.serialize();
    return { ...serialized, delta: this.delta ? this.delta.serialize() : null };
  }

  copy() {
    return new DifferentialCoord(this.x, this.y, this.delta ? this.delta.copy() : null);
  }

  mut_applyDifferential(delta: Coord) {
    if (this.delta === null) {
      throw new Error("delta is null");
    }
    this.mut_translate(this.delta.multiply(delta));
  }

  equals(other: Coord) {
    if (!(other instanceof DifferentialCoord)) return false;
    const deltasEqual =
      this.delta === null
        ? other.delta === null
        : other.delta === null
        ? false
        : this.delta.equals(other.delta);
    return deltasEqual && super.equals(other);
  }
}
