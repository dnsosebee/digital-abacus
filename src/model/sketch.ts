import p5 from "p5";
import { getMouse, getMousePx } from "./coord";
import {
  ADDER_BUTTON,
  CLEAR_BUTTON,
  CONJ_BUTTON,
  drawButtons,
  drawGrid,
  EXP_BUTTON,
  MULTR_BUTTON,
  printToPlot,
} from "./graphics";
import { LinkageGraph } from "./linkages/linkagegraph";
import { ADDER, CONJUGATOR, EXPONENTIAL, MULTIPLIER } from "./linkages/linkageop";
import { LinkagePoint } from "./linkages/linkagepoint";
import { indicator, settings, updateCycles, UPDATE_DIFFERENTIAL, UPDATE_MODE } from "./settings";

export let mainGraph: LinkageGraph | null = null;
export let p: p5 | null = null;
export const activeVertex = null;

function setup(p5: p5, canvasParentRef: Element) {
  p = p5;
  p5.createCanvas(1600, 900).parent(canvasParentRef);
  mainGraph = new LinkageGraph(UPDATE_MODE);
}

function draw(p: p5) {
  //manage double tap
  if (settings.tappedOnce) {
    if (p!.millis() - settings.currentTime > settings.doubleTapTimer) {
      settings.tappedOnce = false;
    }
  }

  //look for bind opportunities
  if (settings.pressAndHold) {
    if (p!.millis() - settings.timerStart > settings.holdLength) {
      settings.indicatorFlash = mainGraph!.findUnify();
    }
  }

  mainGraph!.update(updateCycles);

  p!.background(indicator);

  drawGrid();
  drawButtons();

  //display mode while alternative dependency...
  if (settings.reversingOperator) {
    p!.background(0, 150);
  }

  mainGraph!.display(settings.reversingOperator);

  //digital readout for existing operators
  printToPlot();

  if (settings.indicatorFlash) {
    p!.background(0);
    settings.indicatorFlash = false;
  }

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
  if (settings.reversingOperator) {
    mainGraph!.completeReversal();
    settings.reversingOperator = false;
    return;
  }

  if (CLEAR_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph = new LinkageGraph(UPDATE_MODE);
    return;
  }
  if (ADDER_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph!.addOperation(ADDER);
    return;
  }
  if (MULTR_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph!.addOperation(MULTIPLIER);
    return;
  }
  if (CONJ_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph!.addOperation(CONJUGATOR);
    return;
  }
  if (EXP_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph!.addOperation(EXPONENTIAL);
    return;
  }

  settings.pressAndHold = true;
  settings.timerStart = p!.millis();

  if (!settings.tappedOnce) {
    settings.tappedOnce = true;
    settings.currentTime = p!.millis();
  } else {
    settings.reversingOperator = mainGraph!.startReversal();
    settings.tappedOnce = false;
  }

  settings.activeVertex = mainGraph!.findMouseover();
  if (settings.activeVertex && settings.activeVertex.value instanceof LinkagePoint) {
    settings.activeVertex.value.notifyClick(); // should probably check this returned true
  }

  //update tutorial...
  // tutorialClick();
}

function touchMoved() {
  settings.pressAndHold = false;
  if (settings.activeVertex) {
    if (mainGraph!.mode == UPDATE_DIFFERENTIAL) {
      let mouse = getMouse();
      mainGraph!.applyDifferential(mouse.subtract(settings.activeVertex.value));
    } else {
      settings.activeVertex.value.sendToMouse();
    }
  }
  return false;
}

function touchEnded() {
  settings.pressAndHold = false;
  if (settings.activeVertex) {
    settings.activeVertex.value.notifyRelease();
    settings.activeVertex = null;
    //        mainGraph.update(updateCycles*500);
  }
}
