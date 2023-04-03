import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const StandaloneNode = ({ data, selected }: MathProps) => {
  return (
    <div>
      <DualHandle idx={0} bound={data.vertices[0].isBound()} position={Position.Bottom} />
      <NodeShell row selected={selected}>
        {/* <p className="pl-3 bold font-extrabold text-4xl">Equals Node</p>
        <p className="pl-3 font-extrabold text-2xl">{JSON.stringify(data)}</p> */}
        <Symbol text="#" />
        <NumericInput vertex={data.vertices[0]} />
      </NodeShell>
    </div>
  );
};
