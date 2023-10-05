import { updateLabel } from "@/model/store";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const ConstantNode = ({ data, selected, id }: MathProps) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLabel(id, e.target.value);
  };

  return (
    <div>
      <DualHandle idx={0} bound={true} position={Position.Bottom} style={{ bottom: "-15px" }} />
      <NodeShell row={false} selected={selected} className="round-constant px-4" id={data.edge.id}>
        <Symbol text={data.label} selected={selected} />
        <NumericInput vertex={data.vertices[0]} wide alwaysBound />
      </NodeShell>
    </div>
  );
};
