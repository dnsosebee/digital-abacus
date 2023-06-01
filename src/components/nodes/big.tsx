import { OP_TYPE, PrimitiveOpType } from "@/model/coords/edges/nodeEdge";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const BigNode = ({ data, selected }: MathProps) => {
  const symbol = data.opType === OP_TYPE.COMPOSITE ? data.label : getSymbol(data.opType);

  const firstIdxs = data.vertices.map((v, i) => i).slice(0, -1);
  const numFirstVertices = firstIdxs.length;
  const lastIdx = data.vertices.length - 1;

  return (
    <div>
      {firstIdxs.map((idx) => (
        <DualHandle
          key={idx}
          idx={idx}
          bound={data.vertices[idx].isBound()}
          position={Position.Top}
          style={{ left: `${(100 / numFirstVertices) * (0.5 + idx)}%`, top: "-15px" }}
        />
      ))}
      <NodeShell selected={selected} className="round-binop">
        <div className="flex flex-row space-x-5">
          {firstIdxs.map((idx) => (
            <NumericInput key={idx} vertex={data.vertices[idx]} />
          ))}
        </div>
        <Symbol text={symbol} selected={selected} />
        <NumericInput vertex={data.vertices[lastIdx]} />
      </NodeShell>
      <DualHandle
        idx={lastIdx}
        bound={data.vertices[lastIdx].isBound()}
        position={Position.Bottom}
        style={{ left: "50%", bottom: "-15px" }}
      />
    </div>
  );
};

const getSymbol = (type: PrimitiveOpType): string => {
  switch (type) {
    case OP_TYPE.ADDER:
      return "a + b";
    case OP_TYPE.MULTIPLIER:
      return "a × b";
    default:
      return "???";
  }
};
