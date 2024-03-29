import { Coord } from "./coords/coord/coord";
import { NodeEdge } from "./coords/edges/nodeEdge";
import { settings } from "./settings";
import { p } from "./setup";
import { mainGraph } from "./store";

const TRANSITION_SCALE = 35;

export function drawGrid() {
  const leftEdge = -settings.CENTER_X / settings.globalScale;
  const rightEdge = (p!.width - settings.CENTER_X) / settings.globalScale;
  const topEdge = -settings.CENTER_Y / settings.globalScale;
  const bottomEdge = (p!.height - settings.CENTER_Y) / settings.globalScale;

  const logOfScale = Math.log10(settings.globalScale / TRANSITION_SCALE);
  const gridScale = p!.pow(10, p!.floor(logOfScale));

  //vertical lines
  for (let i = p!.floor(leftEdge * gridScale); i < p!.ceil(rightEdge * gridScale); i++) {
    p!.strokeWeight(1);
    p!.stroke(110);
    p!.noFill();
    p!.line(
      settings.CENTER_X + (i * settings.globalScale) / gridScale,
      0,
      settings.CENTER_X + (i * settings.globalScale) / gridScale,
      p!.height
    );

    p!.textSize(15);
    p!.textAlign(p!.CENTER, p!.CENTER);
    p!.fill(170);
    p!.noStroke();
    p!.ellipse(settings.CENTER_X + (i * settings.globalScale) / gridScale, settings.CENTER_Y, 5, 5);
    p!.text(
      i / gridScale,
      settings.CENTER_X + (i * settings.globalScale) / gridScale,
      settings.CENTER_Y - 16
    );
  }

  //horizontal lines
  for (let i = p!.floor(topEdge * gridScale); i < p!.ceil(bottomEdge * gridScale); i++) {
    p!.strokeWeight(1);
    p!.stroke(110);
    p!.noFill();
    p!.line(
      0,
      settings.CENTER_Y + (i * settings.globalScale) / gridScale,
      p!.width,
      settings.CENTER_Y + (i * settings.globalScale) / gridScale
    );

    p!.textSize(15);
    p!.textAlign(p!.CENTER, p!.CENTER);
    p!.fill(170);
    p!.noStroke();
    p!.ellipse(settings.CENTER_X, settings.CENTER_Y + (i * settings.globalScale) / gridScale, 5, 5);
    p!.text(
      p!.nfc(-(i / gridScale), 2) + "i",
      settings.CENTER_X - 20,
      settings.CENTER_Y + (i * settings.globalScale) / gridScale
    );
  }

  //axes,unit circle
  p!.noFill();
  p!.stroke(140);
  p!.strokeWeight(1);
  p!.line(0, settings.CENTER_Y, p!.width, settings.CENTER_Y);
  p!.line(settings.CENTER_X, 0, settings.CENTER_X, p!.height);
  p!.ellipse(
    settings.CENTER_X,
    settings.CENTER_Y,
    2 * settings.globalScale,
    2 * settings.globalScale
  ); // unit circle
}

// export function drawGrid() {
//   //background grid
//   for (let i = -30; i < 30; i++) {
//     p!.strokeWeight(1);
//     p!.stroke(75);
//     p!.noFill();
//     p!.line(
//       settings.CENTER_X + i * settings.globalScale,
//       0,
//       settings.CENTER_X + i * settings.globalScale,
//       p!.height
//     );
//     p!.line(
//       0,
//       settings.CENTER_Y + i * settings.globalScale,
//       p!.width,
//       settings.CENTER_Y + i * settings.globalScale
//     );
//   }

//   //axes,unit circle
//   p!.noFill();
//   p!.stroke(200);
//   p!.strokeWeight(1);
//   p!.line(0, settings.CENTER_Y, p!.width, settings.CENTER_Y);
//   p!.line(settings.CENTER_X, 0, settings.CENTER_X, p!.height);
//   p!.ellipse(
//     settings.CENTER_X,
//     settings.CENTER_Y,
//     2 * settings.globalScale,
//     2 * settings.globalScale
//   ); // unit circle

//   //coordinate data
//   p!.textSize(15);
//   p!.textAlign(p!.CENTER, p!.CENTER);
//   for (let i = -30; i < 30; i++) {
//     p!.fill(150);
//     p!.noStroke();
//     p!.ellipse(settings.CENTER_X + i * settings.globalScale, settings.CENTER_Y, 5, 5);
//     p!.ellipse(settings.CENTER_X, settings.CENTER_Y + i * settings.globalScale, 5, 5);
//     if (!settings.supressCoords) {
//       p!.text(i, settings.CENTER_X + i * settings.globalScale, settings.CENTER_Y - 16);
//       p!.text(-i + "i", settings.CENTER_X - 20, settings.CENTER_Y + i * settings.globalScale);
//     }
//   }
// }

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
  for (let i = 0; i < mainGraph!().edges.length; i++) {
    if (mainGraph!().edges[i] instanceof NodeEdge) {
      p!.fill(150);
      p!.noStroke();
      h = h - 40;
      p!.text(mainGraph().edges[i].toString(), 200, h);
    }
  }
}
