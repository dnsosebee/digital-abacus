import { CompositeOperation } from "../schema/operation/node/effectives/composite";
import { Operation } from "../schema/operation/operation";
import {
  removeDependencies,
  updateNodeDependencies,
  updateWireDependencies,
  wireVertices,
} from "./updateDependencies";

export const addSubOperation = (operation: CompositeOperation, subOperation: Operation): void => {
  if (subOperation.isNode) {
    if (subOperation.isEffective) {
      updateNodeDependencies(subOperation);
    }
  } else {
    updateWireDependencies(operation, subOperation);
  }
  operation.implementation.push(subOperation);
};

export const removeSubOperation = (operation: CompositeOperation, id: string): void => {
  const idx = operation.implementation.findIndex((o) => o.id === id);
  if (idx === -1) {
    throw new Error("operation not found");
  }
  const removed = operation.implementation.splice(idx, 1)[0];
  if (removed.isNode) {
    return;
  }
  removeDependencies(wireVertices(operation, removed), removed);
};
