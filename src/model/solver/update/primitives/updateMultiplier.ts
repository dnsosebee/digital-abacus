import { getCurrentGraph } from "@/model/useStore";
import { Multiplier } from "../../schema/operation/node/effectives/primitives/multiplier";
import {
  divide,
  getTh,
  isNear,
  isOrigin,
  multiply,
  polar,
  subtract,
  translate,
} from "../../schema/operation/vertex/coord";
import { Vertex } from "../../schema/operation/vertex/vertex";
import { ITERS } from "./updatePrimitive";

export const updateMultiplier = (multiplier: Multiplier): void => {
  const { exposedVertices } = multiplier;
  for (let i = 0; i < ITERS; i++) {
    switch (multiplier.boundVertex) {
      case 0:
        exposedVertices[0] = iterateQuot(
          exposedVertices[2],
          exposedVertices[1],
          exposedVertices[0]
        );
        break;
      case 1:
        exposedVertices[1] = iterateQuot(
          exposedVertices[2],
          exposedVertices[0],
          exposedVertices[1]
        );
        break;
      case 2:
        exposedVertices[2] = iterateProd(
          exposedVertices[0],
          exposedVertices[1],
          exposedVertices[2]
        );
        break;
      default:
        throw new Error("invalid bound vertex");
    }
  }
  updateMultiplierDifferential(multiplier);
};

const iterateQuot = (z: Vertex, zdiv: Vertex, guess: Vertex): Vertex => {
  const { stepSize } = getCurrentGraph();
  if (isOrigin(zdiv.value)) {
    const newValue = translate(guess.value, polar(stepSize, getTh(guess.value)));
    return { ...guess, value: newValue };
  }
  const quot = divide(z.value, zdiv.value);
  if (isNear(quot, guess.value, stepSize)) {
    return { ...guess, value: quot };
  }
  const theta = getTh(subtract(quot, guess.value));
  const newValue = translate(guess.value, polar(stepSize, theta));
  return { ...guess, value: newValue };
};

const iterateProd = (z1: Vertex, z2: Vertex, guess: Vertex): Vertex => {
  const { stepSize } = getCurrentGraph();
  const prod = multiply(z1.value, z2.value);
  if (isNear(prod, guess.value, stepSize)) {
    return { ...guess, value: prod };
  }
  const theta = getTh(subtract(prod, guess.value));
  const newValue = translate(guess.value, polar(stepSize, theta));
  return { ...guess, value: newValue };
};

const updateMultiplierDifferential = (multiplier: Multiplier): void => {
  let fprimeg, fgprime, gsquare;
  const { exposedVertices } = multiplier;
  switch (multiplier.boundVertex) {
    case 0:
      if (exposedVertices[1].delta && exposedVertices[2].delta) {
        fprimeg = multiply(exposedVertices[2].delta, exposedVertices[1].value);
        fgprime = multiply(exposedVertices[2].value, exposedVertices[1].delta);
        gsquare = multiply(exposedVertices[1].value, exposedVertices[1].value);
        exposedVertices[0].delta = divide(subtract(fprimeg, fgprime), gsquare);
      } else {
        exposedVertices[0].delta = null;
      }
      break;
    case 1:
      if (exposedVertices[0].delta && exposedVertices[2].delta) {
        fprimeg = multiply(exposedVertices[2].delta, exposedVertices[0].value);
        fgprime = multiply(exposedVertices[2].value, exposedVertices[0].delta);
        gsquare = multiply(exposedVertices[0].value, exposedVertices[0].value);
        exposedVertices[1].delta = divide(subtract(fprimeg, fgprime), gsquare);
      } else {
        exposedVertices[1].delta = null;
      }
      break;
    case 2:
      if (exposedVertices[0].delta && exposedVertices[1].delta) {
        fprimeg = multiply(exposedVertices[0].delta, exposedVertices[1].value);
        fgprime = multiply(exposedVertices[0].value, exposedVertices[1].delta);
        exposedVertices[2].delta = translate(fprimeg, fgprime);
      } else {
        exposedVertices[2].delta = null;
      }
      break;
    default:
      throw new Error("invalid bound vertex");
  }
};
