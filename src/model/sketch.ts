type p5 = Parameters<SketchProps["setup"]>[0];
import { canvasHeight, canvasWidth } from "@/lib/canvas";
import { SketchProps } from "react-p5/@types";
import { Coord } from "./coords/coord/coord";
import { DifferentialCoord } from "./coords/coord/differentialCoord";
import { drawGrid } from "./graphics";
import { settings, updateCycles } from "./settings";
import { p } from "./setup";
import { mainGraph } from "./store";

export function touchStarted() {
  const vertex = mainGraph.findMouseover();
  if (vertex && vertex.value instanceof DifferentialCoord) {
    settings.dragData = {
      dragging: true,
      panning: false,
      activeVertex: vertex,
    };
    vertex.notifyClick(); // should probably check this returned true
  } else if (p!.mouseX > 0 && p!.mouseX < p!.width && p!.mouseY > 0 && p!.mouseY < p!.height) {
    settings.dragData = {
      dragging: true,
      panning: true,
      panAnchor: new Coord(p!.mouseX, p!.mouseY),
      originalCenter: new Coord(settings.CENTER_X, settings.CENTER_Y),
    };
  }

  //update tutorial...
  // tutorialClick();
}

export function touchMoved() {
  const { dragData } = settings;
  if (dragData.dragging) {
    if (dragData.panning) {
      const { panAnchor, originalCenter } = dragData;
      settings.CENTER_X = originalCenter.x + (p!.mouseX - panAnchor.x);
      settings.CENTER_Y = originalCenter.y + (p!.mouseY - panAnchor.y);
    } else {
      dragData.activeVertex.sendToMouse();
    }
  }
  return false;
}

export function touchEnded() {
  const { dragData } = settings;

  if (dragData.dragging) {
    if (!dragData.panning) {
      dragData.activeVertex.notifyRelease();
    }
  }
  settings.dragData = {
    dragging: false,
  };
}

export function windowResized(p: p5) {
  p.resizeCanvas(canvasWidth(p.windowWidth), canvasHeight(p.windowHeight));
}

export function draw(p: p5) {
  //manage double tap
  // if (settings.tappedOnce) {
  //   if (p!.millis() - settings.currentTime > settings.doubleTapTimer) {
  //     settings.tappedOnce = false;
  //   }
  // }

  mainGraph.update(updateCycles);

  p!.background(80, 85, 105);

  drawGrid();
  // drawButtons();

  // //display mode while alternative dependency...
  // if (settings.reversingOperator) {
  //   p!.background(0, 150);
  // }

  mainGraph.display();

  //digital readout for existing operators
  // printToPlot();

  // if (settings.indicatorFlash) {
  //   p!.background(0);
  //   settings.indicatorFlash = false;
  // }

  //make tutorials run on top of this interactive canvas...
  //    runTutorial();
}
