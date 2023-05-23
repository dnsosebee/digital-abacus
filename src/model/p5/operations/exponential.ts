import { Exponential } from "@/model/solver/operation/node/effectives/primitives/exponential";
import { getR } from "@/model/solver/operation/vertex/coord";
import { getCurrentGraph } from "@/model/useStore";
import { toPx } from "../graphics";
import { p } from "../linkages";

export function displayExponential(exponential: Exponential) {
  const { centerX, centerY, scale } = getCurrentGraph().linkagesSettings;
  const { exposedVertices } = exponential;
  const exposedVerticesPx = exposedVertices.map((vertex) => toPx(vertex.value));
  p!.stroke(200, 100, 200);
  if (exposedVertices[0].selected || exposedVertices[1].selected) {
    const b = exposedVerticesPx[0].x / exposedVerticesPx[0].y;
    const a = 1;
    let theta = -12 * p!.PI;
    p!.beginShape();
    for (let i = 0; i < 12000; i++) {
      theta += p!.PI / 100;
      if (b * theta < 5) {
        // don't try to plot coords further out than e^5
        // polar is r * p!.cos(th), r * p!.sin(th)
        const polar = {
          x: a * p!.exp(b * theta) * p!.cos(theta),
          y: a * p!.exp(b * theta) * p!.sin(theta),
        };
        const polarPx = toPx(polar);
        p!.vertex(polarPx.x, polarPx.y);
      }
    }
    p!.endShape();
  }
  p!.line(exposedVerticesPx[0].x, 0, exposedVerticesPx[0].x, p!.height);
  const r = getR(exposedVertices[1].value);
  p!.ellipse(centerX, centerY, 2 * scale * r, 2 * scale * r);
}
