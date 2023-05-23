import { OP_TYPE, OpType } from "@/model/coords/edges/nodeEdge";
import { isBound } from "@/src2/model/graph/operation/node/effectives/effective";
import { PrimitiveOperation } from "@/src2/model/graph/operation/node/effectives/primitives/primitive";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const BinopNode = ({ data, selected }: MathProps) => {
  const { exposedVertices, opType, id, boundVertex } = data.operation as PrimitiveOperation;
  return (
    <div>
      <DualHandle
        idx={0}
        bound={isBound(exposedVertices[0])}
        position={Position.Top}
        style={{ left: "25%" }}
      />
      <DualHandle
        idx={1}
        bound={isBound(exposedVertices[1])}
        position={Position.Top}
        style={{ left: "75%" }}
      />
      <NodeShell selected={selected}>
        <div className="flex flex-row space-x-10">
          <NumericInput vertex={exposedVertices[0]} id={{ operationId: id, index: 0 }} />
          <NumericInput vertex={exposedVertices[1]} id={{ operationId: id, index: 1 }} />
        </div>
        <Symbol text={getSymbol(opType)} />
        <NumericInput vertex={exposedVertices[2]} id={{ operationId: id, index: 2 }} />
      </NodeShell>
      <DualHandle
        idx={2}
        bound={isBound(exposedVertices[2])}
        position={Position.Bottom}
        style={{ left: "50%" }}
      />
    </div>
  );
};

const getSymbol = (type: OpType): string => {
  switch (type) {
    case OP_TYPE.ADDER:
      return "+";
    case OP_TYPE.MULTIPLIER:
      return "*";
    default:
      return "???";
  }
};
