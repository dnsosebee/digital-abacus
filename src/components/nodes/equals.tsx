import { Equals } from "@/schema/node";
import { Handle, Node, NodeProps, Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { NodeShell } from "./nodeShell";

export type EqualsNodeData = Equals["data"];
export type EqualsNode = Node<EqualsNodeData>;
export type EqualsProps = NodeProps<EqualsNodeData>;

export const EqualsNode = ({ data, selected }: EqualsProps) => {
  return (
    <div>
      <Handle id="valTarget" type="target" position={Position.Left} />
      <NodeShell row selected={selected}>
        {/* <p className="pl-3 bold font-extrabold text-4xl">Equals Node</p>
        <p className="pl-3 font-extrabold text-2xl">{JSON.stringify(data)}</p> */}
        <Symbol text="=" />
        <NumericInput value={data.value} readOnly={false} />
      </NodeShell>
      <Handle id="valSource" type="source" position={Position.Right} />
    </div>
  );
};
