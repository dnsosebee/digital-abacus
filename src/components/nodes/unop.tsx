import { OP_TYPE, OpType } from "@/model/coords/edges/nodeEdge";
import { isBound } from "@/src2/model/graph/operation/node/effectives/effective";
import { PrimitiveOperation } from "@/src2/model/graph/operation/node/effectives/primitives/primitive";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const UnopNode = ({ data, selected }: MathProps) => {
  const { exposedVertices, opType, id, boundVertex } = data.operation as PrimitiveOperation;
  return (
    <div>
      <DualHandle idx={0} bound={isBound(exposedVertices[0])} position={Position.Top} />
      <NodeShell selected={selected}>
        <NumericInput vertex={exposedVertices[0]} id={{ operationId: id, index: 0 }} />
        <Symbol text={getSymbol(opType)} />
        <NumericInput vertex={exposedVertices[1]} id={{ operationId: id, index: 1 }} />
      </NodeShell>
      <DualHandle idx={1} bound={isBound(exposedVertices[1])} position={Position.Bottom} />
    </div>
  );
};

const getSymbol = (opType: OpType): string => {
  switch (opType) {
    case OP_TYPE.EXPONENTIAL:
      return "e^";
    case OP_TYPE.CONJUGATOR:
      return "z̄";
    default:
      return "???";
  }
};
