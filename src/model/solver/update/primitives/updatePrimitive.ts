import { PrimitiveOperation } from "../../schema/operation/node/effectives/primitives/primitive";
import { updateAdder } from "./updateAdder";
import { updateConjugator } from "./updateConjugator";
import { updateExponential } from "./updateExponential";
import { updateMultiplier } from "./updateMultiplier";

export const updatePrimitive = (child: PrimitiveOperation): void => {
  let updateValue: (primitive: PrimitiveOperation) => void;
  let updateDifferential: (primitive: PrimitiveOperation) => void;
  switch (child.opType) {
    case "adder":
      updateAdder(child);
      break;
    case "multiplier":
      updateMultiplier(child);
      break;
    case "conjugator":
      updateConjugator(child);
      break;
    case "exponential":
      updateExponential(child);
      break;
    case "standalone":
      break;
    default:
      throw new Error("unknown primitive type");
  }
};

export const ITERS = 3;
