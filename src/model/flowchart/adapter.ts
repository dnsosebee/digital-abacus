import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { NodeOperation, handleNumToId } from "../solver/schema/operation/node/node";
import { WireOperation } from "../solver/schema/operation/wire";

export const operationToWire = (operation: WireOperation): Wire => ({
  id: operation.id,
  selected: operation.selected,
  source: operation.sourceVertexId.operationId,
  sourceHandle: handleNumToId(operation.sourceVertexId.index),
  target: operation.targetVertexId.operationId,
  targetHandle: handleNumToId(operation.targetVertexId.index),
  type: "coord",
  animated: true,
});

export const operationToNode = (operation: NodeOperation): CircuitNode => {
  return operation.isEffective
    ? {
        id: operation.id,
        selected: operation.selected,
        type: "math",
        position: operation.position,
        data: {
          operation: operation,
        },
      }
    : {
        id: operation.id,
        selected: operation.selected,
        type: "sticky",
        position: operation.position,
        data: {
          text: operation.label,
        },
      };
};
