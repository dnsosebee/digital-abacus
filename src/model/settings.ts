import { Vertex } from "./graph/vertex";
import { LinkagePoint } from "./linkages/linkagepoint";

export const UPDATE_IDEAL = 0;
export const UPDATE_ITERATIVE = 1;
export const UPDATE_DIFFERENTIAL = 2;

//////////////////////////////////

export const UPDATE_MODE = UPDATE_DIFFERENTIAL;

//background color and debug variable
export const indicator = 50;

//how far to look in each direction
export const searchSize = 0.02;

//how many iterations to run before updating
export const iterations = 1;

// how many adjustment iterations to run after automatic differentiation
export const DIFF_ITERS = 1;

//extra number of loops for updating positions, helps with rigidity
export const updateCycles = 5;

//center coords.
export const CENTER_X = 650;
export const CENTER_Y = 450;

//global scale (standard, 50px = 1 unit)
export const DEFAULT_SCALE = 50;

export const settings = {
  globalScale: DEFAULT_SCALE,

  //double tap reference (sketch level)
  tappedOnce: false,
  currentTime: -1,
  doubleTapTimer: 300,

  //press and hold references
  pressAndHold: false,
  timerStart: -1,
  holdLength: 700,

  // mode-switch boolean, for going into state of switching a dependency
  reversingOperator: false,

  indicatorFlash: false,

  //turns off cartesian coordinates when focusing on polar coordinates
  supressCoords: false,

  // show little derivatives near nodes
  showDifferentials: true,

  // activeVertex
  activeVertex: null as null | Vertex<LinkagePoint>,
};
