import { logger as parentLogger } from "@/lib/logger";
import { z } from "zod";
import { Vertex, VertexId, serialVertexSchema } from "../graph/vertex";
import { settings } from "../settings";
import { p } from "../sketch";
import { Coord, getMouse, getMousePx } from "./coord/coord";
import { DifferentialCoord } from "./coord/differentialCoord";

const logger = parentLogger.child({ module: "CoordVertex" });

export const serialCoordVertexSchema = serialVertexSchema.extend({
  dragging: z.boolean(),
  hidden: z.boolean(),
  selected: z.boolean(),
});

export type SerialCoordVertex = z.infer<typeof serialCoordVertexSchema>;

export class CoordVertex extends Vertex<DifferentialCoord> {
  dragging: boolean;
  hidden: boolean;
  selected: boolean;

  constructor(
    value: DifferentialCoord,
    id: VertexId,
    dragging = false,
    hidden = false,
    selected = false
  ) {
    // position of point
    super(value, id);

    this.dragging = dragging;
    this.hidden = hidden;
    this.selected = selected;
  }

  serialize(): SerialCoordVertex {
    const serialized = super.serialize();
    return { ...serialized, dragging: this.dragging, hidden: this.hidden, selected: this.selected };
  }

  checkMouseover() {
    // :-> bool
    if (this.hidden) {
      return false;
    }
    return this.value.isNearPx(getMousePx(), 25);
  }

  notifyClick() {
    // :-> bool
    if (this.hidden && !this.selected) {
      return false;
    }
    if (this.isFree() && this.checkMouseover()) {
      this.dragging = true;
      this.selected = true;
      if (this.value instanceof DifferentialCoord) {
        this.value.delta = new Coord(1, 0);
      }
    }
    return this.dragging;
  }

  notifyRelease() {
    this.dragging = false;
    this.selected = false;
    if (this.value instanceof DifferentialCoord) {
      this.value.delta = new Coord(0, 0);
    }
  }

  sendToMouse() {
    if (this.dragging) {
      this.value.mut_sendTo(getMouse());
    }
  }

  sendToXY(x: number, y: number) {
    this.value.mut_sendTo(new Coord(x, y));
  }

  _drawNode(reversalFocus: boolean = false, reversalTarget: boolean = false) {
    // this.selected

    p!.noStroke();
    if (reversalFocus) {
      p!.fill(255, 0, 0);
    } else if (reversalTarget) {
      p!.fill(255, 255, 0);
    } else {
      p!.fill(255);
    }
    logger.debug("drawing node at " + this.value.getXPx() + ", " + this.value.getYPx());
    p!.ellipse(this.value.getXPx(), this.value.getYPx(), 15, 15);
  }

  _drawSelected() {
    p!.fill(96, 165, 250);
    p!.noStroke();
    p!.rect(this.value.getXPx() - 15, this.value.getYPx() - 15, 30, 30, 8);
  }

  _drawRing() {
    p!.noFill();
    p!.stroke(255, 200);
    p!.strokeWeight(3);
    p!.ellipse(this.value.getXPx(), this.value.getYPx(), 20, 20);
  }

  display(reversalFocus: boolean = false, reversalTarget: boolean = false) {
    // :bool -> void
    if (this.hidden && !this.selected && !this.dragging) {
      return;
    }

    if (this.selected) {
      this._drawSelected();
    }

    this._drawNode(reversalFocus, reversalTarget);

    if (this.isFree() && !this.hidden) {
      this._drawRing();
    }

    if (settings.showDifferentials && this.value instanceof DifferentialCoord) {
      p!.fill(255);
      p!.noStroke();
      p!.text(this.value.delta.toString(), this.value.getXPx() + 10, this.value.getYPx() - 20);
    }
  }
}
