import { EffectiveOperation } from "@/model/solver/operation/node/effectives/effective";
import { p } from "../linkages";
import { displayAdder } from "./adder";
import { displayConjugator } from "./conjugator";
import { displayExponential } from "./exponential";
import { displayMultiplier } from "./multiplier";

export function displayOperation(operation: EffectiveOperation) {
  if (operation.hideLinkages && !operation.selected) {
    return;
  }
  p!.noFill();
  p!.strokeWeight(1);
  if (operation.selected) {
    p!.strokeWeight(4);
  }
  if (operation.isPrimitive) {
    switch (operation.opType) {
      case "adder":
        displayAdder(operation);
        break;
      case "multiplier":
        displayMultiplier(operation);
        break;
      case "conjugator":
        displayConjugator(operation);
        break;
      case "exponential":
        displayExponential(operation);
        break;
      case "standalone":
        break; // Nothing to display
      default:
        throw new Error("Unexpected primitive operation");
    }
  } else {
    return; // Nothing to display, yet
  }
}
