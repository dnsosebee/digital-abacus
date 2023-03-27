import { logger as parentLogger } from "@/lib/logger";
import { Vertex, VertexId } from "../graph/vertex";
import { settings } from "../settings";
import { p } from "../sketch";
import { Coord, getMouse, getMousePx } from "./coord/coord";
import { DifferentialCoord } from "./coord/differentialCoord";

const logger = parentLogger.child({ module: "CoordVertex" });

export class CoordVertex extends Vertex<Coord> {
  dragging: boolean;
  hidden: boolean;

  constructor(datum: Coord, id: VertexId) {
    // position of point
    super(datum, id);

    this.dragging = false;
    this.hidden = false;
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
    if (this.hidden) {
      return false;
    }
    if (this.isFree() && this.checkMouseover()) {
      this.dragging = true;
      if (this.value instanceof DifferentialCoord) {
        this.value.delta = new Coord(1, 0);
      }
    }
    return this.dragging;
  }

  notifyRelease() {
    this.dragging = false;
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

  _drawNode(reversing = false) {
    p!.noStroke();
    if (reversing) {
      p!.fill(255);
    } else {
      p!.fill(100, 150, 255);
    }
    p!.ellipse(this.value.getXPx(), this.value.getYPx(), 15, 15);
  }

  _drawRing() {
    p!.noFill();
    p!.stroke(255, 200);
    p!.strokeWeight(3);
    p!.ellipse(this.value.getXPx(), this.value.getYPx(), 20, 20);
  }

  display(reversing = false) {
    // :bool -> void
    if (this.hidden) {
      return;
    }

    this._drawNode(reversing);

    if (this.isFree()) {
      this._drawRing();
    }

    if (settings.showDifferentials && this.value instanceof DifferentialCoord) {
      p!.fill(255);
      p!.noStroke();
      p!.text(this.value.delta.toString(), this.value.getXPx() + 10, this.value.getYPx() - 20);
    }
  }
}
