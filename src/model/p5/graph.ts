import { checkIfTarget } from "../solver/graph";
import { CompositeOperation } from "../solver/operation/node/effectives/composite";
import { EffectiveOperation, isBound } from "../solver/operation/node/effectives/effective";
import { distance } from "../solver/operation/vertex/coord";
import { Vertex, VertexId, vertexIdEq } from "../solver/operation/vertex/vertex";
import { getCurrentGraph } from "../useStore";
import { toPx } from "./graphics";
import { p } from "./linkages";
import { displayOperation } from "./operations/operation";
import { displayVertex } from "./vertex";

export function displayCurrentGraph() {
  const currentGraph = getCurrentGraph();
  const { operation } = currentGraph;
  operation.implementation.forEach((op) => {
    if (op.isNode && op.isEffective) {
      displayOperation(op);
      op.exposedVertices.forEach((vertex, i) => {
        const vertexId = { operationId: op.id, index: i };
        let isFocus = false;
        let isTarget = false;
        const { inversionState } = currentGraph;
        if (inversionState.inverting) {
          if (vertexIdEq(inversionState.focus, vertexId)) {
            isFocus = true;
          } else if (checkIfTarget(currentGraph, vertexId)) {
            isTarget = true;
          }
        }
        displayVertex(vertex, isFocus, isTarget, operation.hideLinkages);
      });
    }
  });
}

export function getVisibleVertexAtMouse() {
  const { operation } = getCurrentGraph();
  return getVisibleVertexShallow(operation);
}

const getVisibleVertexSingle = (
  operation: EffectiveOperation
): { vertexId: VertexId; vertex: Vertex; bound: boolean } | null => {
  const mouse = { x: p!.mouseX, y: p!.mouseY };
  if (operation.hideLinkages) {
    return null;
  }
  let result: { vertexId: VertexId; vertex: Vertex; bound: boolean } | null = null;
  for (let i = 0; i < operation.exposedVertices.length; i++) {
    const vertex = operation.exposedVertices[i];
    const vertexId = { operationId: operation.id, index: i };
    if (isNear(vertex, mouse)) {
      if (isBound(vertex)) {
        result = { vertexId, vertex, bound: true };
      } else {
        return { vertexId, vertex, bound: false };
      }
    }
  }
  return result;
};

const getVisibleVertexShallow = (
  operation: CompositeOperation
): { vertexId: VertexId; vertex: Vertex; bound: boolean } | null => {
  if (operation.hideLinkages) {
    return null;
  }
  let result = getVisibleVertexSingle(operation);
  if (result && !result.bound) {
    return result;
  }
  for (let i = 0; i < operation.implementation.length; i++) {
    const op = operation.implementation[i];
    if (op.isNode && op.isEffective) {
      const res = getVisibleVertexSingle(op);
      if (res) {
        if (res.bound) {
          result = res;
        } else {
          return res;
        }
      }
    }
  }
  return result;
};

//prefer unbound vertices
// const getVisibleVertexRecursive = (
//   operation: EffectiveNodeOperation
// ): { vertexId: VertexId; vertex: Vertex; bound: boolean } | null => {
//   if (operation.hideLinkages) {
//     return null;
//   }

//   let result: { vertexId: VertexId; vertex: Vertex; bound: boolean } | null = null;
//   const mouse = { x: p!.mouseX, y: p!.mouseY };
//   operation.exposedVertices.forEach((vertex, i) => {
//     const vertexId = { operationId: operation.id, index: i };
//     if (isNear(vertex, mouse)) {
//       if (isBound(vertex)) {
//         return { vertexId, vertex, bound: true };
//       } else {
//         result = { vertexId, vertex, bound: false };
//       }
//     }
//   });
//   if (operation.isPrimitive) {
//     return result;
//   }
//   operation.implementation.forEach((op) => {
//     if (op.isNode && op.isEffective) {
//       const res = getVisibleVertexRecursive(op);
//       if (res) {
//         if (res.bound) {
//           return res;
//         } else {
//           result = res;
//         }
//       }
//     }
//   });
//   return result;
// };

const isNear = (vertex: Vertex, mouse: { x: number; y: number }) => {
  const d = distance(toPx(vertex.value), mouse);
  return d < 25;
};
