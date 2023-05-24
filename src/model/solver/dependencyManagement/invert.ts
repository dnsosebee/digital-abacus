import {
  CompositeOperation,
  getShallowVertex,
} from "../schema/operation/node/effectives/composite";
import { PrimitiveOperation } from "../schema/operation/node/effectives/primitives/primitive";
import { Dep, VertexId, vertexIdEq } from "../schema/operation/vertex/vertex";
import { WireOperation } from "../schema/operation/wire";
import { updateNodeDependencies, updateWireDependencies } from "./updateDependencies";

export const invert = (parent: CompositeOperation, path: Dep[]): boolean => {
  if (path.length === 0) {
    return true;
  }
  const [dep, ...rest] = path;
  const currentRes = invertOperation(parent, dep);
  if (currentRes) {
    const restRes = invert(parent, rest);
    if (restRes) {
      return true;
    }
    // abort!
    const abortRes = invertOperation(parent, dep);
    if (abortRes) {
      return false;
    }
    throw new Error("failed to abort");
  }
  return false;
};

const invertOperation = (parent: CompositeOperation, dep: Dep): boolean => {
  const child = parent.implementation.find((op) => op.id === dep.bindingOperation);
  if (!child) {
    return false;
  }
  if (child.isNode) {
    if (child.isEffective) {
      if (child.isPrimitive) {
        return invertPrimitive(child, dep);
      }
      return invertComposite(child, dep);
    } else {
      throw new Error("cannot invert ineffective node");
    }
  } else {
    return invertWire(parent, child, dep);
  }
};

const invertPrimitive = (child: PrimitiveOperation, dep: Dep): boolean => {
  if (child.boundVertex === dep.vertexId.index) {
    return false;
  }
  child.boundVertex = dep.vertexId.index;
  updateNodeDependencies(child);
  return true;
};

const invertComposite = (child: CompositeOperation, dep: Dep): boolean => {
  if (child.boundVertex === dep.vertexId.index) {
    return false;
  }
  const innerPath = targetPath(
    child,
    { operationId: child.id, index: child.boundVertex },
    dep.vertexId
  );
  if (!innerPath) {
    return false;
  }
  const res = invert(child, innerPath);
  if (!res) {
    return false;
  }
  child.boundVertex = dep.vertexId.index;
  updateNodeDependencies(child);
  return true;
};

const invertWire = (parent: CompositeOperation, child: WireOperation, dep: Dep): boolean => {
  if (child.targetVertexId.index === dep.vertexId.index) {
    return false;
  }
  const oldTarget = { ...child.targetVertexId };
  child.targetVertexId = { ...dep.vertexId };
  child.sourceVertexId = oldTarget;
  updateWireDependencies(parent, child);
  return true;
};

export const targetPath = (
  parent: CompositeOperation,
  sourceId: VertexId,
  targetId: VertexId,
  seen: VertexId[] = []
): Dep[] | null => {
  if (vertexIdEq(sourceId, targetId)) {
    return [];
  }
  const source = getShallowVertex(parent, sourceId);
  if (!source) {
    throw new Error("source vertex not found");
  }
  const { deps } = source;
  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];
    if (seen.findIndex((v) => vertexIdEq(v, dep.vertexId)) === -1) {
      const path = targetPath(parent, dep.vertexId, targetId, [...seen, sourceId]);
      if (path !== null) {
        return [dep, ...path];
      }
    }
  }
  return null;
};
