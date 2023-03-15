var mainGraph = null;
var activeVertex = null;

function setup(p5, canvasParentRef) {
  createCanvas(1600, 900).parent(canvasParentRef);
  mainGraph = new LinkageGraph(UPDATE_MODE);
}

function draw() {
  //manage double tap
  if (tappedOnce) {
    if (millis() - currentTime > doubleTapTimer) {
      tappedOnce = false;
    }
  }

  //look for bind opportunities
  if (pressAndHold) {
    if (millis() - timerStart > holdLength) {
      indicatorFlash = mainGraph.findUnify();
    }
  }

  mainGraph.update(updateCycles);

  background(indicator);

  drawGrid();
  drawButtons();

  //display mode while alternative dependency...
  if (reversingOperator) {
    background(0, 150);
  }

  mainGraph.display(reversingOperator);

  //digital readout for existing operators
  printToPlot();

  if (indicatorFlash) {
    background(0);
    indicatorFlash = false;
  }

  //make tutorials run on top of this interactive canvas...
  //    runTutorial();
}

console.log("setup defined");

function keyPressed() {
  //n for 'next'
  if (keyCode === 78 && level != myLevels.length - 1) {
    level++;
  }

  //p for 'previous'
  if (keyCode === 80 && level != 0) {
    level--;
  }
}

function touchStarted() {
  if (reversingOperator) {
    mainGraph.completeReversal();
    reversingOperator = false;
    return;
  }

  if (CLEAR_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph = new LinkageGraph(UPDATE_MODE);
    return;
  }
  if (ADDER_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(ADDER);
    return;
  }
  if (MULTR_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(MULTIPLIER);
    return;
  }
  if (CONJ_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(CONJUGATOR);
    return;
  }
  if (EXP_BUTTON.isNear(getMousePx(), 10)) {
    mainGraph.addOperation(EXPONENTIAL);
    return;
  }

  pressAndHold = true;
  timerStart = millis();

  if (!tappedOnce) {
    tappedOnce = true;
    currentTime = millis();
  } else {
    reversingOperator = mainGraph.startReversal();
    tappedOnce = false;
  }

  activeVertex = mainGraph.findMouseover();
  if (activeVertex) {
    activeVertex.value.notifyClick(); // should probably check this returned true
  }

  //update tutorial...
  // tutorialClick();
}

function touchMoved() {
  pressAndHold = false;
  if (activeVertex) {
    if (mainGraph.mode == UPDATE_DIFFERENTIAL) {
      let mouse = getMouse();
      mainGraph.applyDifferential(mouse.subtract(activeVertex.value));
    } else {
      activeVertex.value.sendToMouse();
    }
  }
  return false;
}

function touchEnded() {
  pressAndHold = false;
  if (activeVertex) {
    activeVertex.value.notifyRelease();
    activeVertex = null;
    //        mainGraph.update(updateCycles*500);
  }
}
