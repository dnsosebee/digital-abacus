import { OpType, OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const BinopNode = ({ data, selected }: MathProps) => {
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
      <NodeShell selected={selected}>
        <div className="flex flex-row space-x-10">
          <NumericInput vertex={data.vertices[0]} />
          <NumericInput vertex={data.vertices[1]} />
        </div>
        <Symbol text={getSymbol(data.opType)} />
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
