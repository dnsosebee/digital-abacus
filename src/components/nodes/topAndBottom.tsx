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
      <NodeShell
        selected={selected}
        className={`${bottom.length === 1 ? "round-binop" : "round-unop"}`}
        id={edge.id}
      >
        <div className="flex flex-row space-x-5 self-stretch justify-evenly">
          {top.map((idx) => (
            <div key={idx}>
              {vertices[idx].label !== "" && (<div className="absolute visible text-white" style={{ left: `${(100 / top.length) * (0.57 + idx)}%`, top: "-25px" }}>{vertices[idx].label}</div>)}
              <NumericInput key={idx} vertex={vertices[idx]} />
            </div>
          ))}
        </div>
        <Symbol text={edge.label} selected={selected} />
        <div className="flex flex-row space-x-5 self-stretch justify-evenly">
          {bottom.map((idx, layoutIdx) => (
            <div key={idx}>
            {vertices[idx].label !== "" && (<div className="absolute visible text-white" style={{ left: `${(100 / bottom.length) * (0.57 + layoutIdx)}%`, bottom: "-25px" }}>{vertices[idx].label}</div>)}
            <NumericInput key={idx} vertex={vertices[idx]} />
          </div>
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
