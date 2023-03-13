import { Value } from "@/schema/node";
import { Handle, Node, NodeProps, Position } from "reactflow";

export type ValueNodeData = Value["data"];
export type ValueNode = Node<ValueNodeData>;
export type ValueProps = NodeProps<ValueNodeData>;

export const ValueNode = ({
  data: {
    value: { x, y },
    mode,
  },
  selected,
}: ValueProps) => {
  return (
    <div>
      <Handle id="valTarget" type="target" position={Position.Top} />
      <p className="pl-3 bold font-extrabold text-4xl">Value Node</p>
      <p className="pl-3 font-extrabold text-2xl">{JSON.stringify({ x, y, mode })}</p>
      <Handle id="valSource" type="source" position={Position.Bottom} />
    </div>
  );
};
