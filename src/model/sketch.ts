// import p5 from "p5";
import { SketchProps } from "react-p5/@types";
import { DifferentialCoord } from "./coords/coord/differentialCoord";
import { drawGrid } from "./graphics";
import { indicator, settings, updateCycles } from "./settings";
import { mainGraph } from "./store";

type p5 = Parameters<SketchProps["setup"]>[0];

export let p: p5 | null = null;

export function setup(p5: p5, canvasParentRef: Element) {
  p = p5;
  p5.createCanvas(1600, 900).parent(canvasParentRef);
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

  settings.activeVertex = mainGraph.findMouseover();
  if (settings.activeVertex && settings.activeVertex.value instanceof DifferentialCoord) {
    settings.activeVertex.notifyClick(); // should probably check this returned true
  }

  //update tutorial...
  // tutorialClick();
}

export function touchMoved() {
  if (settings.activeVertex) {
    settings.activeVertex.sendToMouse();
    // if (mainGraph.mode == UPDATE_DIFFERENTIAL) {
    //   let mouse = getMouse();
    //   mainGraph.applyDifferential(mouse.subtract(settings.activeVertex.value));
    // } else {
    //   settings.activeVertex.sendToMouse();
    // }
  }
  return false;
}

export function touchEnded() {
  if (settings.activeVertex) {
    settings.activeVertex.notifyRelease();
    settings.activeVertex = null;
    //        mainGraph.update(updateCycles*500);
  }
}
