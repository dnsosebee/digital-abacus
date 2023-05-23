import { Coord } from "../solver/operation/vertex/coord";
import { getCurrentGraph } from "../useStore";
import { p } from "./linkages";

export function drawGrid() {
  const {
    operation: { id },
    linkagesSettings: { centerX, centerY, scale },
  } = getCurrentGraph();
  //background grid
  for (let i = -30; i < 30; i++) {
    p!.strokeWeight(1);
    p!.stroke(75);
    p!.noFill();
    p!.line(centerX + i * scale, 0, centerX + i * scale, p!.height);
    p!.line(0, centerY + i * scale, p!.width, centerY + i * scale);
  }

  //axes,unit circle
  p!.noFill();
  p!.stroke(200);
  p!.strokeWeight(1);
  p!.line(0, centerY, p!.width, centerY);
  p!.line(centerX, 0, centerX, p!.height);
  p!.ellipse(centerX, centerY, 2 * scale, 2 * scale); // unit circle

  //coordinate data
  p!.textSize(15);
  p!.textAlign(p!.CENTER, p!.CENTER);
  for (let i = -30; i < 30; i++) {
    p!.fill(150);
    p!.noStroke();
    p!.ellipse(centerX + i * scale, centerY, 5, 5);
    p!.ellipse(centerX, centerY + i * scale, 5, 5);
    // if (!settings.supressCoords) {
    //   p!.text(i, centerX + i * scale, centerY - 16);
    //   p!.text(-i + "i", centerX - 20, centerY + i * scale);
    // }
  }
}

// export function printToPlot() {
//   //On-canvas DRO for operators...
//   p!.textAlign(p!.CENTER, p!.CENTER);
//   p!.textSize(30);

//   let h = p!.height - 40;
//   for (let i = 0; i < mainGraph!.edges.length; i++) {
//     if (mainGraph!.edges[i] instanceof NodeEdge) {
//       p!.fill(150);
//       p!.noStroke();
//       h = h - 40;
//       p!.text(mainGraph!.edges[i].toString(), 200, h);
//     }
//   }
// }

export function toPx(coord: Coord): Coord {
  const {
    linkagesSettings: { centerX, centerY, scale },
  } = getCurrentGraph();
  return {
    x: coord.x * scale + centerX,
    y: -coord.y * scale + centerY,
  };
}

export function toAxis(px: Coord): Coord {
  const {
    linkagesSettings: { centerX, centerY, scale },
  } = getCurrentGraph();
  return {
    x: (px.x - centerX) / scale,
    y: (centerY - px.y) / scale,
  };
}
