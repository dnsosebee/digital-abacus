import { z } from "zod";
import { Operation, operationSchema } from "../../operation";
import { Vertex, VertexId } from "../../vertex/vertex";
import { WireOperation } from "../../wire";
import { baseEffectiveNodeOperationSchema } from "./baseEffective";
import { EffectiveOperation } from "./effective";

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
