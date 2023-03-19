import { Coord } from "./coord";
import { LinkageOp } from "./linkages/linkageop";
import { CENTER_X, CENTER_Y, settings } from "./settings";
import { mainGraph, p } from "./sketch";

export function drawGrid() {
  //background grid
  for (let i = -30; i < 30; i++) {
    p!.strokeWeight(1);
    p!.stroke(75);
    p!.noFill();
    p!.line(CENTER_X + i * settings.globalScale, 0, CENTER_X + i * settings.globalScale, p!.height);
    p!.line(0, CENTER_Y + i * settings.globalScale, p!.width, CENTER_Y + i * settings.globalScale);
  }

  //axes,unit circle
  p!.noFill();
  p!.stroke(200);
  p!.strokeWeight(1);
  p!.line(0, CENTER_Y, p!.width, CENTER_Y);
  p!.line(CENTER_X, 0, CENTER_X, p!.height);
  p!.ellipse(CENTER_X, CENTER_Y, 2 * settings.globalScale, 2 * settings.globalScale); // unit circle

  //coordinate data
  p!.textSize(15);
  p!.textAlign(p!.CENTER, p!.CENTER);
  for (let i = -30; i < 30; i++) {
    p!.fill(150);
    p!.noStroke();
    p!.ellipse(CENTER_X + i * settings.globalScale, CENTER_Y, 5, 5);
    p!.ellipse(CENTER_X, CENTER_Y + i * settings.globalScale, 5, 5);
    if (!settings.supressCoords) {
      p!.text(i, CENTER_X + i * settings.globalScale, CENTER_Y - 16);
      p!.text(-i + "i", CENTER_X - 20, CENTER_Y + i * settings.globalScale);
    }
  }
}

export const CLEAR_BUTTON = new Coord(30, 30);
export const ADDER_BUTTON = new Coord(30, 60);
export const MULTR_BUTTON = new Coord(30, 90);
export const CONJ_BUTTON = new Coord(30, 120);
export const EXP_BUTTON = new Coord(30, 150);

export function drawButtons() {
  p!.textSize(15);
  p!.textAlign(p!.LEFT, p!.CENTER);

  p!.noStroke();
  p!.fill(200);
  p!.ellipse(30, 30, 20, 20);
  p!.text("clear", 45, 30);

  p!.fill(30, 200, 255);
  p!.ellipse(30, 60, 20, 20);
  p!.text("adder", 45, 60);

  p!.fill(255, 100, 0);
  p!.ellipse(30, 90, 20, 20);
  p!.text("multiplier", 45, 90);

  p!.fill(30, 30, 200);
  p!.ellipse(30, 120, 20, 20);
  p!.text("conjugator", 45, 120);

  p!.fill(100, 100, 0);
  p!.ellipse(30, 150, 20, 20);
  p!.text("exponential", 45, 150);
}

export function printToPlot() {
  //On-canvas DRO for operators...
  p!.textAlign(p!.CENTER, p!.CENTER);
  p!.textSize(30);

  let h = p!.height - 40;
  for (let i = 0; i < mainGraph!.edges.length; i++) {
    if (mainGraph!.edges[i] instanceof LinkageOp) {
      p!.fill(150);
      p!.noStroke();
      h = h - 40;
      p!.text(mainGraph!.edges[i].toString(), 200, h);
    }
  }
}