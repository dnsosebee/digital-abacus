import { proxy } from "valtio";
import { Coord } from "./coords/coord/coord";
import { CoordVertex } from "./coords/coordVertex";

export const UPDATE_IDEAL = 0;
export const UPDATE_ITERATIVE = 1;
// export const UPDATE_DIFFERENTIAL = 2;

//////////////////////////////////

export const UPDATE_MODE = UPDATE_ITERATIVE;

//background color and debug variable
export const indicator = 30;

//how far to look in each direction
export const searchSize = 0.02;

//how many iterations to run before updating
export const iterations = 3;

// how many adjustment iterations to run after automatic differentiation
export const DIFF_ITERS = 1;

//extra number of loops for updating positions, helps with rigidity
export const updateCycles = 5;

//global scale (standard, 50px = 1 unit)
export const DEFAULT_SCALE = 50;

type DragData =
  | {
      dragging: false;
    }
  | {
      dragging: true;
      panning: false;
      activeVertex: CoordVertex;
    }
  | {
      dragging: true;
      panning: true;
      panAnchor: Coord;
      originalCenter: Coord;
    };

export const settings = proxy({
  CENTER_X: 650,
  CENTER_Y: 450,
  globalScale: DEFAULT_SCALE,
  dragData: {
    dragging: false,
  } as DragData,

  // //double tap reference (sketch level)
  // tappedOnce: false,
  // currentTime: -1,
  // doubleTapTimer: 300,

  // //press and hold references
  // pressAndHold: false,
  // timerStart: -1,
  // holdLength: 700,

  // mode-switch boolean, for going into state of switching a dependency
  // reversingOperator: false,

  // indicatorFlash: false,

  // //turns off cartesian coordinates when focusing on polar coordinates
  supressCoords: false,

  // show little derivatives near nodes
  showDifferentials: false,

  stepSize: searchSize,

  showComplex: false,

  showLinkages: true,
  showSidebar: true,
});
