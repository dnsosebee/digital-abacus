import { NodeEdge } from "@/model/coords/edges/nodeEdge";
import { CompositeOperation } from "@/model/coords/operations/composites/compositeOperation";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { NodeShell } from "./nodeShell";

type TopAndBottomProps = {
  selected: boolean;
  edge: NodeEdge;
};

export const TopAndBottomNode = ({ edge, selected }: TopAndBottomProps) => {
  const compositeOperation = edge.constraint as CompositeOperation;
  const vertices = edge.vertices;
  const { top, bottom } = compositeOperation.layout!.data;
  console.log({ label: edge.label });

  return (
    <div>
      {top.map((idx, layoutIdx) => (
        <DualHandle
          key={idx}
          idx={idx}
          bound={vertices[idx].isBound()}
          position={Position.Top}
          style={{ left: `${(100 / top.length) * (0.5 + layoutIdx)}%`, top: "-15px" }}
        />
      ))}
      <NodeShell selected={selected} className={bottom.length === 1 ? "round-binop" : "round-unop"}>
        <div className="flex flex-row space-x-5">
          {top.map((idx) => (
            <NumericInput key={idx} vertex={vertices[idx]} />
          ))}
        </div>
        <Symbol text={edge.label} selected={selected} />
        <div className=" flex flex-row space-x-5 items-stretch">
          {bottom.map((idx) => (
            <NumericInput key={idx} vertex={vertices[idx]} />
          ))}
        </div>
      </NodeShell>
      {bottom.map((idx, layoutIdx) => (
        <DualHandle
          key={idx}
          idx={idx}
          bound={vertices[idx].isBound()}
          position={Position.Bottom}
          style={{ left: `${(100 / bottom.length) * (0.5 + layoutIdx)}%`, bottom: "-15px" }}
        />
      ))}
    </div>
  );
};
