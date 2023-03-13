import { Equals } from "@/schema/node";
import { Handle, Node, NodeProps, Position } from "reactflow";

export type EqualsNodeData = Equals["data"];
export type EqualsNode = Node<EqualsNodeData>;
export type EqualsProps = NodeProps<EqualsNodeData>;

export const EqualsNode = ({ data, selected }: EqualsProps) => {
  return (
    <div>
      <Handle id="valTarget" type="target" position={Position.Left} />
      <p className="pl-3 bold font-extrabold text-4xl">Value Node</p>
      <p className="pl-3 font-extrabold text-2xl">{JSON.stringify(data)}</p>
      <Handle id="valSource" type="source" position={Position.Right} />
    </div>
  );
};
