import { getCurrentGraph } from "@/model/useStore";
import { Adder } from "../../schema/operation/node/effectives/primitives/adder";
import { getTh, isNear, polar, subtract, translate } from "../../schema/operation/vertex/coord";
import { Vertex } from "../../schema/operation/vertex/vertex";
import { ITERS } from "./updatePrimitive";

export const updateAdder = (adder: Adder): void => {
  const { exposedVertices } = adder;
  for (let i = 0; i < ITERS; i++) {
    switch (adder.boundVertex) {
      case 0:
        exposedVertices[0] = iterateDiff(
          exposedVertices[2],
          exposedVertices[1],
          exposedVertices[0]
        );
        break;
      case 1:
        exposedVertices[1] = iterateDiff(
          exposedVertices[2],
          exposedVertices[0],
          exposedVertices[1]
        );
        break;
      case 2:
        exposedVertices[2] = iterateSum(exposedVertices[0], exposedVertices[1], exposedVertices[2]);
        break;
      default:
        throw new Error(`invalid bound vertex ${adder.boundVertex}`);
    }
  }
  updateAdderDifferentials(adder);
};

const updateAdderDifferentials = (adder: Adder): void => {
  const { exposedVertices } = adder;
  switch (adder.boundVertex) {
    case 0:
      if (exposedVertices[1].delta && exposedVertices[2].delta) {
        exposedVertices[0].delta = subtract(exposedVertices[2].delta, exposedVertices[1].delta);
      } else {
        exposedVertices[0].delta = null;
      }
      break;
    case 1:
      if (exposedVertices[0].delta && exposedVertices[2].delta) {
        exposedVertices[1].delta = subtract(exposedVertices[2].delta, exposedVertices[0].delta);
      } else {
        exposedVertices[1].delta = null;
      }
      break;
    case 2:
      if (exposedVertices[0].delta && exposedVertices[1].delta) {
        exposedVertices[2].delta = translate(exposedVertices[0].delta, exposedVertices[1].delta);
      } else {
        exposedVertices[2].delta = null;
      }
      break;
    default:
      throw new Error("invalid bound vertex");
  }
};

const iterateDiff = (z: Vertex, zsub: Vertex, guess: Vertex): Vertex => {
  const { stepSize } = getCurrentGraph();
  const diff = subtract(z.value, zsub.value);
  if (isNear(diff, guess.value, stepSize)) {
    return { ...guess, value: diff };
  }
  const theta = getTh(subtract(diff, guess.value));
  const newValue = translate(guess.value, polar(stepSize, theta));
  return { ...guess, value: newValue };
};

const iterateSum = (z1: Vertex, z2: Vertex, guess: Vertex): Vertex => {
  const sum = translate(z1.value, z2.value);
  const { stepSize } = getCurrentGraph();
  if (isNear(sum, guess.value, stepSize)) {
    return { ...guess, value: sum };
  }
  const theta = getTh(subtract(sum, guess.value));
  const newValue = translate(guess.value, polar(stepSize, theta));
  return { ...guess, value: newValue };
};
