import { Unop } from "@/schema/node";
import { Handle, Node, NodeProps, Position } from "reactflow";

export type UnopNodeData = Unop["data"];
export type UnopNode = Node<UnopNodeData>;
export type UnopProps = NodeProps<UnopNodeData>;

export const UnopNode = ({ data, selected }: UnopProps) => {
  return (
    <div>
      <Handle id="operand" type="target" position={Position.Top} />
      <p className="pl-3 bold font-extrabold text-4xl">Unop Node</p>
      <p className="pl-3 font-extrabold text-2xl">{JSON.stringify(data)}</p>
      <Handle id="result" type="source" position={Position.Bottom} />
    </div>
  );
};
