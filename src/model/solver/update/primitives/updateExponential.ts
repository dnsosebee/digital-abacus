import { getCurrentGraph } from "@/model/useStore";
import { Exponential } from "../../schema/operation/node/effectives/primitives/exponential";
import {
  divide,
  exp,
  getTh,
  isNear,
  log,
  multiply,
  nearestN,
  polar,
  subtract,
  translate,
} from "../../schema/operation/vertex/coord";
import { Vertex } from "../../schema/operation/vertex/vertex";
import { ITERS } from "./updatePrimitive";

export const updateExponential = (exponential: Exponential): void => {
  const { exposedVertices } = exponential;
  for (let i = 0; i < ITERS; i++) {
    switch (exponential.boundVertex) {
      case 0:
        exposedVertices[0] = iterateLog(exposedVertices[1], exposedVertices[0]);
        break;
      case 1:
        exposedVertices[1] = iterateExp(exposedVertices[0], exposedVertices[1]);
        break;
      default:
        throw new Error("invalid bound vertex");
    }
  }
  updateExponentialDifferential(exponential);
};

const iterateLog = (z: Vertex, guess: Vertex): Vertex => {
  const { stepSize } = getCurrentGraph();
  const zlog = log(z.value, nearestN(log(z.value, 0), guess.value));
  if (isNear(zlog, guess.value, stepSize)) {
    return { ...guess, value: zlog };
  } else {
    const theta = getTh(subtract(zlog, guess.value));
    const newValue = translate(guess.value, polar(stepSize, theta));
    return { ...guess, value: newValue };
  }
};

const iterateExp = (z: Vertex, guess: Vertex): Vertex => {
  const { stepSize } = getCurrentGraph();
  const zexp = exp(z.value);
  if (isNear(zexp, z.value, stepSize)) {
    return { ...guess, value: zexp };
  } else {
    const theta = getTh(subtract(zexp, z.value));
    const newValue = translate(guess.value, polar(stepSize, theta));
    return { ...guess, value: newValue };
  }
};

const updateExponentialDifferential = (exponential: Exponential): void => {
  const { exposedVertices, boundVertex } = exponential;
  switch (boundVertex) {
    case 0:
      if (exposedVertices[1].delta) {
        exposedVertices[0].delta = divide(exposedVertices[1].delta, exposedVertices[0].value);
      } else {
        exposedVertices[0].delta = null;
      }
      break;
    case 1:
      if (exposedVertices[0].delta) {
        exposedVertices[1].delta = multiply(exposedVertices[0].delta, exposedVertices[1].value);
      } else {
        exposedVertices[1].delta = null;
      }
      break;
    default:
      throw new Error("invalid bound vertex");
  }
};
