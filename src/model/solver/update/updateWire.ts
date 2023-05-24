import { getCurrentGraph } from "@/model/useStore";
import { wireVertices } from "../dependencyManagement/updateDependencies";
import { CompositeOperation } from "../schema/operation/node/effectives/composite";
import { getR, getTh, isNear, polar, subtract, translate } from "../schema/operation/vertex/coord";
import { Vertex } from "../schema/operation/vertex/vertex";
import { WireOperation } from "../schema/operation/wire";
import { ITERS } from "./primitives/updatePrimitive";

export const updateWire = (parent: CompositeOperation, wire: WireOperation): void => {
  const vs = wireVertices(parent, wire);
  for (let i = 0; i < ITERS; i++) {
    vs[1] = iterateWire(wire, vs[0], vs[1]);
  }
};

const iterateWire = (wire: WireOperation, z: Vertex, guess: Vertex): Vertex => {
  const { stepSize } = getCurrentGraph();
  if (!z.delta) {
    wire.tracked = false;
  }
  if (!wire.tracked) {
    guess.delta = z.delta;
  }
  if (isNear(z.value, guess.value, stepSize * 4)) {
    if (wire.tracked) {
      guess.delta = { x: 0, y: 0 };
      z.delta = { x: 0, y: 0 };
      wire.tracked = false;
    }
    return { ...guess, value: z.value };
  }
  if (wire.tracked) {
    wire.delayCounter++;
    if (wire.delayCounter < getR(z.delta!)) {
      return guess;
    }
    wire.delayCounter = 0;
  }
  const theta = findApproachAngle(wire, z, guess);
  const newValue = translate(guess.value, polar(stepSize, theta));
  return { ...guess, value: newValue };
};

const findApproachAngle = (wire: WireOperation, z: Vertex, guess: Vertex): number => {
  let phi = getTh(subtract(z.value, guess.value));
  let theta = phi;

  if (wire.tracked && z.delta) {
    const psi = getTh(z.delta);
    const M = getR(z.delta);

    const bound = Math.acos(1 / M);
    if (M > 1 && -bound < psi && psi < bound) {
      // logger.debug("running away");
      const numerator = M * Math.sin(-psi);
      const denominator = Math.sqrt(1 + M * M - 2 * M * Math.cos(-psi));
      theta = Math.asin(numerator / denominator) + Math.PI + phi;
    } else if ((0 < M && M < 1) || (M == 1 && psi != 0)) {
      const numerator = M * Math.sin(psi);
      const denominator = Math.sqrt(1 + M * M - 2 * M * Math.cos(psi));
      theta = Math.asin(numerator / denominator) + phi;
    }
  }
  return theta;
};
