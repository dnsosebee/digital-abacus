import { OP_TYPE, PrimitiveOpType } from "@/model/coords/edges/nodeEdge";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const UnopNode = ({ data, selected }: MathProps) => {
  const symbol = data.opType === OP_TYPE.COMPOSITE ? data.label : getSymbol(data.opType);
  return (
    <div>
      <DualHandle
        idx={0}
        bound={data.vertices[0].isBound()}
        position={Position.Top}
        style={{ top: "-15px" }}
      />
      <NodeShell selected={selected} className="round-unop">
        <NumericInput vertex={data.vertices[0]} />
        <Symbol text={symbol} selected={selected} />
        <NumericInput vertex={data.vertices[1]} />
      </NodeShell>
      <DualHandle
        idx={1}
        bound={data.vertices[1].isBound()}
        position={Position.Bottom}
        style={{ bottom: "-15px" }}
      />
    </div>
  );
};

const getSymbol = (opType: PrimitiveOpType): string => {
  switch (opType) {
    case OP_TYPE.EXPONENTIAL:
      return "eᵃ";
    case OP_TYPE.CONJUGATOR:
      return "ā";
    default:
      return "???";
  }
};
