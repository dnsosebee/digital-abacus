import {
  CompositeOperation,
  getShallowVertex,
} from "../schema/operation/node/effectives/composite";
import { EffectiveOperation } from "../schema/operation/node/effectives/effective";
import { Operation } from "../schema/operation/operation";
import { Vertex, VertexId } from "../schema/operation/vertex/vertex";
import { WireOperation } from "../schema/operation/wire";

export const wireVertices = (parent: CompositeOperation, child: WireOperation): Vertex[] => {
  const sourceVertex = getShallowVertex(parent, child.sourceVertexId);
  const targetVertex = getShallowVertex(parent, child.targetVertexId);
  if (!sourceVertex || !targetVertex) {
    throw new Error("wire vertices not found");
  }
  return [sourceVertex, targetVertex];
};

export const removeDependencies = (vertices: Vertex[], operation: Operation): void => {
  vertices.forEach((v) => {
    v.deps = v.deps.filter((dep) => dep.bindingOperation !== operation.id);
  });
};

export const updateNodeDependencies = (child: EffectiveOperation): void => {
  const { boundVertex, exposedVertices } = child;
  const vertexIds = exposedVertices.map((v, i) => ({ operationId: child.id, index: i }));
  updateDependencies(exposedVertices, vertexIds, boundVertex, child);
};

export const updateWireDependencies = (parent: CompositeOperation, child: WireOperation): void => {
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
