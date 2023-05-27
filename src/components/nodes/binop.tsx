import { OP_TYPE, PrimitiveOpType } from "@/model/coords/edges/nodeEdge";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const BinopNode = ({ data, selected }: MathProps) => {
  const symbol = data.opType === OP_TYPE.COMPOSITE ? data.label : getSymbol(data.opType);

  return (
    <div>
      <DualHandle
        idx={0}
        bound={data.vertices[0].isBound()}
        position={Position.Top}
        style={{ left: "25%" }}
      />
      <DualHandle
        idx={1}
        bound={data.vertices[1].isBound()}
        position={Position.Top}
        style={{ left: "75%" }}
      />
      <NodeShell selected={selected} className="round-binop">
        <div className="flex flex-row space-x-5">
          <NumericInput vertex={data.vertices[0]} />
          <NumericInput vertex={data.vertices[1]} />
        </div>
        <Symbol text={symbol} />
        <NumericInput vertex={data.vertices[2]} />
      </NodeShell>
      <DualHandle
        idx={2}
        bound={data.vertices[2].isBound()}
        position={Position.Bottom}
        style={{ left: "50%" }}
      />
    </div>
  );
};

const getSymbol = (type: PrimitiveOpType): string => {
  switch (type) {
    case OP_TYPE.ADDER:
      return "+";
    case OP_TYPE.MULTIPLIER:
      return "*";
    default:
      return "???";
  }
};
