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
  selected: boolean;

  constructor(datum: Coord, id: VertexId) {
    // position of point
    super(datum, id);

    this.dragging = false;
    this.hidden = false;
    this.selected = false;
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
    } else if (this.dragging || this.selected) {
      p!.fill(96, 165, 250);
    } else {
      p!.fill(255);
    }
    logger.debug("drawing node at " + this.value.getXPx() + ", " + this.value.getYPx());
    p!.ellipse(this.value.getXPx(), this.value.getYPx(), 15, 15);
  }

  _drawRing() {
    p!.noFill();
    p!.stroke(255, 200);
    p!.strokeWeight(3);
    p!.ellipse(this.value.getXPx(), this.value.getYPx(), 20, 20);
  }

  display(reversalFocus: boolean = false, reversalTarget: boolean = false) {
    // :bool -> void
    if (this.hidden) {
      return;
    }

    this._drawNode(reversalFocus, reversalTarget);

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
