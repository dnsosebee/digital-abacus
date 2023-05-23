import { logger } from "@/lib/logger";
import { z } from "zod";
import { Operation, operationSchema } from "../../operation";
import { Dep, Vertex, VertexId, vertexIdEq } from "../../vertex/vertex";
import { WireOperation } from "../../wire";
import { baseEffectiveNodeOperationSchema } from "./baseEffective";
import { EffectiveOperation } from "./effective";
import { PrimitiveOperation } from "./primitives/primitive";

const baseCompositeOperationSchema = baseEffectiveNodeOperationSchema.extend({
  isPrimitive: z.literal(false),
  boundVertex: z.number(),
});

type BaseCompositeOperation = z.infer<typeof baseCompositeOperationSchema> & {
  implementation: Operation[];
};

export const compositeOperationSchema: z.ZodType<BaseCompositeOperation> =
  baseCompositeOperationSchema.extend({
    implementation: z.array(z.lazy(() => operationSchema)),
  });

export type CompositeOperation = z.infer<typeof compositeOperationSchema>;

export const getSubOperation = (
  operation: CompositeOperation,
  id: string
): Operation | undefined => {
  let found: Operation | undefined;
  operation.implementation.forEach((op) => {
    if (op.id === id) {
      found = op;
    }
    if (op.isNode && op.isEffective && !op.isPrimitive) {
      const found = getSubOperation(op, id);
      if (found) {
        return found;
      }
    }
  });
  return found;
};

export const getShallowVertex = (
  operation: CompositeOperation,
  vertexId: VertexId
): Vertex | undefined => {
  if (operation.id === vertexId.operationId) {
    return operation.exposedVertices[vertexId.index];
  }
  for (let i = 0; i < operation.implementation.length; i++) {
    const op = operation.implementation[i];
    if (op.id === vertexId.operationId && op.isNode && op.isEffective) {
      return op.exposedVertices[vertexId.index];
    }
  }
  return undefined;
};

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

const removeDependencies = (vertices: Vertex[], operation: Operation): void => {
  vertices.forEach((v) => {
    v.deps = v.deps.filter((dep) => dep.bindingOperation !== operation.id);
  });
};

const updateNodeDependencies = (child: EffectiveOperation): void => {
  const { boundVertex, exposedVertices } = child;
  const vertexIds = exposedVertices.map((v, i) => ({ operationId: child.id, index: i }));
  updateDependencies(exposedVertices, vertexIds, boundVertex, child);
};

const wireVertices = (parent: CompositeOperation, child: WireOperation): Vertex[] => {
  const sourceVertex = getShallowVertex(parent, child.sourceVertexId);
  const targetVertex = getShallowVertex(parent, child.targetVertexId);
  if (!sourceVertex || !targetVertex) {
    throw new Error("wire vertices not found");
  }
  return [sourceVertex, targetVertex];
};

const updateWireDependencies = (parent: CompositeOperation, child: WireOperation): void => {
  const childVertices = wireVertices(parent, child);
  const vertexIds = [child.sourceVertexId, child.targetVertexId];
  updateDependencies(childVertices, vertexIds, 1, child); // 1 is for target vertex
};

const updateDependencies = (
  vertices: Vertex[],
  vertexIds: VertexId[],
  boundVertex: number,
  operation: Operation
): void => {
  removeDependencies(vertices, operation);
  const internallyFreeVertices = vertexIds.filter((v, i) => i !== boundVertex);
  const internallyBoundVertex = vertices[boundVertex];
  internallyFreeVertices.forEach((id) => {
    internallyBoundVertex.deps.push({
      bindingOperation: operation.id,
      vertexId: id,
    });
  });
};

export const invert = (parent: CompositeOperation, path: Dep[]): boolean => {
  logger.debug("inverting", path);
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
  logger.debug("inverting operation", dep);
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
  logger.debug("inverting primitive", dep);
  if (child.boundVertex === dep.vertexId.index) {
    return false;
  }
  child.boundVertex = dep.vertexId.index;
  updateNodeDependencies(child);
  return true;
};

const invertComposite = (child: CompositeOperation, dep: Dep): boolean => {
  logger.debug("inverting composite", dep);
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
  logger.debug("inverting wire", dep);
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
