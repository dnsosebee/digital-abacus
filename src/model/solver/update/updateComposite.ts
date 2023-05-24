import { CompositeOperation } from "../schema/operation/node/effectives/composite";
import { updatePrimitive } from "./primitives/updatePrimitive";
import { updateWire } from "./updateWire";

export const updateComposite = (parent: CompositeOperation): void => {
  parent.implementation.forEach((op) => {
    if (op.isNode) {
      if (op.isEffective) {
        if (op.isPrimitive) {
          updatePrimitive(op);
        } else {
          updateComposite(op);
        }
      }
    } else {
      updateWire(parent, op);
    }
  });
};
