// import p5 from "p5";
import { SketchProps } from "react-p5/@types";
import { Coord } from "./coords/coord/coord";
import { DifferentialCoord } from "./coords/coord/differentialCoord";
import { drawGrid } from "./graphics";
import { indicator, settings, updateCycles } from "./settings";
import { mainGraph } from "./store";

type p5 = Parameters<SketchProps["setup"]>[0];

export let p: p5 | null = null;

export function setup(p5: p5, canvasParentRef: Element) {
  p = p5;
  p5.createCanvas(p.windowWidth / 2, p.windowHeight - 40).parent(canvasParentRef);
}

export function windowResized(p: p5) {
  p.resizeCanvas(p.windowWidth / 2, p.windowHeight - 40);
}

export function draw(p: p5) {
  //manage double tap
  // if (settings.tappedOnce) {
  //   if (p!.millis() - settings.currentTime > settings.doubleTapTimer) {
  //     settings.tappedOnce = false;
  //   }
  // }

  mainGraph.update(updateCycles);

  p!.background(indicator);

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

console.log("setup defined");

// TODO: commented this out since myLevels is not defined
// function keyPressed() {
//   //n for 'next'
//   if (p!.keyCode === 78 && p!.level != myLevels.length - 1) {
//     level++;
//   }

//   //p for 'previous'
//   if (keyCode === 80 && level != 0) {
//     level--;
//   }
// }

// let activeVertex: Vertex<Coord> | null = null;

export function touchStarted() {
  // if (settings.reversingOperator) {
  //   mainGraph.completeReversal();
  //   settings.reversingOperator = false;
  //   return;
  // }
  /*
  if (CLEAR_BUTTON.isNear(getMousePx(), 10)) {
    resetGraph();
    return;
  }
  if (ADDER_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(OP_TYPE.ADDER);
    return;
  }
  if (MULTR_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(OP_TYPE.MULTIPLIER);
    return;
  }
  if (CONJ_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(OP_TYPE.CONJUGATOR);
    return;
  }
  if (EXP_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(OP_TYPE.EXPONENTIAL);
    return;
  }
*/
  // if (!settings.tappedOnce) {
  //   settings.tappedOnce = true;
  //   settings.currentTime = p!.millis();
  // } else {
  //   // settings.reversingOperator = mainGraph.startReversal();
  //   settings.tappedOnce = false;
  // }

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
