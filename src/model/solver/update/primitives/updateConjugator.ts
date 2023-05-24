import { getCurrentGraph } from "../../../useStore";
import { Conjugator } from "../../schema/operation/node/effectives/primitives/conjugator";
import { getTh, isNear, polar, subtract, translate } from "../../schema/operation/vertex/coord";
import { Vertex } from "../../schema/operation/vertex/vertex";
import { ITERS } from "./updatePrimitive";

export const updateConjugator = (conjugator: Conjugator): void => {
  const { exposedVertices } = conjugator;
  for (let i = 0; i < ITERS; i++) {
    switch (conjugator.boundVertex) {
      case 0:
        exposedVertices[0] = iterateConjugate(exposedVertices[1], exposedVertices[0]);
        break;
      case 1:
        exposedVertices[1] = iterateConjugate(exposedVertices[0], exposedVertices[1]);
        break;
      default:
        throw new Error("invalid bound vertex");
    }
  }
  updateConjugatorDifferential(conjugator);
};

const iterateConjugate = (z: Vertex, guess: Vertex): Vertex => {
  const { stepSize } = getCurrentGraph();
  const conj = { x: guess.value.x, y: -guess.value.y };
  if (isNear(conj, z.value, stepSize)) {
    return { ...guess, value: conj };
  }
  const theta = getTh(subtract(conj, z.value));
  const newValue = translate(guess.value, polar(stepSize, theta));
  return { ...guess, value: newValue };
};

const updateConjugatorDifferential = (conjugator: Conjugator): void => {
  const { exposedVertices, boundVertex } = conjugator;
  exposedVertices[boundVertex].delta = null;
};
