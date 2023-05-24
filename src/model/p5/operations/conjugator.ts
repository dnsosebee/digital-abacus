import { Conjugator } from "@/model/solver/schema/operation/node/effectives/primitives/conjugator";
import { getCurrentGraph } from "@/model/useStore";
import { toPx } from "../graphics";
import { p } from "../linkages";

export function displayConjugator(conjugator: Conjugator) {
  const { centerX, centerY } = getCurrentGraph().linkagesSettings;
  const { exposedVertices } = conjugator;
  const exposedVerticesPx = exposedVertices.map((vertex) => toPx(vertex.value));

  p!.stroke(30, 30, 200);
  p!.line(centerX, centerY, exposedVerticesPx[0].x, exposedVerticesPx[0].y);
  p!.line(centerX, centerY, exposedVerticesPx[1].x, exposedVerticesPx[1].y);
  p!.line(
    exposedVerticesPx[0].x,
    exposedVerticesPx[0].y,
    exposedVerticesPx[1].x,
    exposedVerticesPx[1].y
  );
}
