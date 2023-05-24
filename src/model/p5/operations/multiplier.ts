import { Multiplier } from "@/model/solver/schema/operation/node/effectives/primitives/multiplier";
import { getCurrentGraph } from "@/model/useStore";
import { toPx } from "../graphics";
import { p } from "../linkages";

export function displayMultiplier(multiplier: Multiplier) {
  const { centerX, centerY } = getCurrentGraph().linkagesSettings;
  const { exposedVertices } = multiplier;
  const exposedVerticesPx = exposedVertices.map((vertex) => toPx(vertex.value));

  p!.stroke(255, 0, 0);
  p!.line(centerX, centerY, exposedVerticesPx[2].x, exposedVerticesPx[2].y);
  p!.stroke(255, 100, 0);
  p!.line(centerX, centerY, exposedVerticesPx[0].x, exposedVerticesPx[0].y);
  p!.line(centerX, centerY, exposedVerticesPx[1].x, exposedVerticesPx[1].y);
}
