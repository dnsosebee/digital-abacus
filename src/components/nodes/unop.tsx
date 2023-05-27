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
      <DualHandle idx={0} bound={data.vertices[0].isBound()} position={Position.Top} />
      <NodeShell selected={selected} className="rounded-3xl">
        <NumericInput vertex={data.vertices[0]} />
        <Symbol text={symbol} />
        <NumericInput vertex={data.vertices[1]} />
      </NodeShell>
      <DualHandle idx={1} bound={data.vertices[1].isBound()} position={Position.Bottom} />
    </div>
  );
};

const getSymbol = (opType: PrimitiveOpType): string => {
  switch (opType) {
    case OP_TYPE.EXPONENTIAL:
      return "e^";
    case OP_TYPE.CONJUGATOR:
      return "z̄";
    default:
      return "???";
  }
};
