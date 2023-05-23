import { isBound } from "../model/solver/operation/node/effectives/effective";
import { Coord } from "../model/solver/operation/vertex/coord";
import { Vertex } from "../model/solver/operation/vertex/vertex";
import { store } from "../model/useStore";
import { toPx } from "./graphics";
import { p } from "./linkages";

export function displayVertex(
  vertex: Vertex,
  reversalFocus = false,
  reversalTarget = false,
  hidden = false
) {
  if (hidden && !vertex.selected) {
    return;
  }
  const { showDifferentials } = store.globalSettings;
  const px = toPx(vertex.value);
  if (vertex.selected) {
    drawSelectionRect(px);
  }

  drawNode(px, reversalFocus, reversalTarget);

  if (!isBound(vertex) && !hidden) {
    drawDraggableRing(px);
  }

  if (showDifferentials && vertex.differential) {
    p!.fill(255);
    p!.noStroke();
    p!.text(vertex.differential.toString(), px.x + 10, px.y - 20);
  }
}

function drawSelectionRect(px: Coord) {
  p!.fill(96, 165, 250);
  p!.noStroke();
  p!.rect(px.x - 15, px.y - 15, 30, 30, 8);
}

function drawDraggableRing(px: Coord) {
  p!.noFill();
  p!.stroke(255, 200);
  p!.strokeWeight(3);
  p!.ellipse(px.x, px.y, 20, 20);
}

function drawNode(px: Coord, reversalFocus: boolean = false, reversalTarget: boolean = false) {
  p!.noStroke();
  if (reversalFocus) {
    p!.fill(255, 0, 0);
  } else if (reversalTarget) {
    p!.fill(255, 255, 0);
  } else {
    p!.fill(255);
  }
  p!.ellipse(px.x, px.y, 15, 15);
}
