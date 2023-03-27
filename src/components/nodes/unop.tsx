import { OpType, OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const UnopNode = ({ data, selected }: MathProps) => {
  return (
    <div>
      <DualHandle idx={0} bound={data.vertices[0].isBound()} position={Position.Top} />
      <NodeShell selected={selected}>
        <NumericInput vertex={data.vertices[0]} />
        <Symbol text={getSymbol(data.opType)} />
        <NumericInput vertex={data.vertices[1]} />
      </NodeShell>
      <DualHandle idx={1} bound={data.vertices[1].isBound()} position={Position.Bottom} />
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
