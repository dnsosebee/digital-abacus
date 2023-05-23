import { drawGrid, toAxis } from "@/model/p5/graphics";
import { SketchProps } from "react-p5/@types";
import { isBound } from "../solver/operation/node/effectives/effective";
import { Vertex, VertexId } from "../solver/operation/vertex/vertex";
import { getCurrentGraph, getVertex, updateCurrentGraph } from "../useStore";
import { displayCurrentGraph, getVisibleVertexAtMouse } from "./graph";

type p5 = Parameters<SketchProps["setup"]>[0];

export let p: p5 | null = null;

const INDICATOR = 50;

export function setup(p5: p5, canvasParentRef: Element) {
  p = p5;
  p5.createCanvas(p.windowWidth / 2, p.windowHeight - 40).parent(canvasParentRef);
}

export function windowResized(p: p5) {
  p.resizeCanvas(p.windowWidth / 2, p.windowHeight - 40);
}

export function draw(p: p5) {
  updateCurrentGraph();

  p!.background(INDICATOR);

  drawGrid();

  displayCurrentGraph();
}

export function touchStarted() {
  const res = getVisibleVertexAtMouse() as { vertexId: VertexId; vertex: Vertex } | null;
  const { linkagesSettings, mode } = getCurrentGraph();
  if (res) {
    const { vertexId, vertex } = res;
    linkagesSettings.dragData = {
      dragging: true,
      panning: false,
      activeVertexId: vertexId,
    };
    vertex.selected = true;
    if (!isBound(vertex)) {
      // vertex.dragging = true;

      if (mode === "iterative") {
        vertex.differential = { x: 0, y: 0 };
      }
    }
  } else if (p!.mouseX > 0 && p!.mouseX < p!.width && p!.mouseY > 0 && p!.mouseY < p!.height) {
    linkagesSettings.dragData = {
      dragging: true,
      panning: true,
      panStart: { x: p!.mouseX, y: p!.mouseY },
      originalCenter: { x: linkagesSettings.centerX, y: linkagesSettings.centerY },
    };
  }
}

export function touchMoved() {
  const { linkagesSettings } = getCurrentGraph();
  const { dragData, centerX, centerY } = linkagesSettings;
  if (dragData.dragging) {
    if (dragData.panning) {
      const { panStart, originalCenter } = dragData;
      linkagesSettings.centerX = originalCenter.x + p!.mouseX - panStart.x;
      linkagesSettings.centerY = originalCenter.y + p!.mouseY - panStart.y;
    } else {
      const { activeVertexId } = dragData;
      const vertex = getVertex(activeVertexId);
      if (vertex) {
        if (!isBound(vertex)) {
          vertex.value = toAxis({ x: p!.mouseX, y: p!.mouseY });
        }
      } else {
        throw new Error("Vertex not found");
      }
    }
  }
}

export function touchEnded() {
  const { linkagesSettings } = getCurrentGraph();
  const { dragData } = linkagesSettings;
  if (dragData.dragging) {
    if (!dragData.panning) {
      const { activeVertexId } = dragData;
      const vertex = getVertex(activeVertexId);
      if (vertex) {
        vertex.selected = false;
        // vertex.dragging = false;
      } else {
        throw new Error("Vertex not found");
      }
    }
    linkagesSettings.dragData = {
      dragging: false,
    };
  }
}
