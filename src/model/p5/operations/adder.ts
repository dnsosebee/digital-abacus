import { Adder } from "@/model/solver/schema/operation/node/effectives/primitives/adder";
import { getCurrentGraph } from "@/model/useStore";
import { toPx } from "../graphics";
import { p } from "../linkages";

export function displayAdder(adder: Adder) {
  const { centerX, centerY } = getCurrentGraph().linkagesSettings;
  const { exposedVertices } = adder;
  p!.stroke(30, 200, 255);
  p!.beginShape();
  p!.vertex(centerX, centerY);
  const exposedVerticesPx = exposedVertices.map((v) => toPx(v.value));
  p!.vertex(exposedVerticesPx[0].x, exposedVerticesPx[0].y);
  p!.vertex(exposedVerticesPx[2].x, exposedVerticesPx[2].y);
  p!.vertex(exposedVerticesPx[1].x, exposedVerticesPx[1].y);

  p!.vertex(centerX, centerY);
  p!.endShape();
}
