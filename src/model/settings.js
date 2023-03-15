const UPDATE_IDEAL = 0;
const UPDATE_ITERATIVE = 1;
const UPDATE_DIFFERENTIAL = 2;

//////////////////////////////////

const UPDATE_MODE = UPDATE_DIFFERENTIAL;

//background color and debug variable
const indicator = 50;

//how far to look in each direction
const searchSize = .02;

//how many iterations to run before updating
const iterations = 1;

// how many adjustment iterations to run after automatic differentiation
const DIFF_ITERS = 1;

//extra number of loops for updating positions, helps with rigidity
const updateCycles = 5;

//center coords.
const CENTER_X = 650;
const CENTER_Y = 450;

//global scale (standard, 50px = 1 unit)
const DEFAULT_SCALE = 50;
var globalScale = DEFAULT_SCALE;

//double tap reference (sketch level)
var tappedOnce = false;
var currentTime;
var doubleTapTimer = 300;

//press and hold references
var pressAndHold = false;
var timerStart ;
var holdLength = 700;

// mode-switch boolean, for going into state of switching a dependency
var reversingOperator = false;

var indicatorFlash = false;

//turns off cartesian coordinates when focusing on polar coordinates
var supressCoords = false;

// show little derivatives near nodes
var showDifferentials = true;
