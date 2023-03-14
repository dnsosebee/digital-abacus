import { Sticky, Unop } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { NodeShell } from "./nodeShell";

export type StickyNodeData = Sticky["data"];
export type StickyNode = Node<StickyNodeData>;
export type StickyProps = NodeProps<StickyNodeData>;

export const StickyNode = ({ data, selected }: StickyProps) => {
  return (
    <div>
      <NodeShell selected={selected}>
        <h1 className="text-2xl font-bold">✍️</h1>
        <textarea className="w-full h-full p-2 nodrag" value={data.text} readOnly={true} />
      </NodeShell>
    </div>
  );
};

const getSymbol = (operator: Unop["data"]["operator"]): string => {
  switch (operator) {
    case "exp":
      return "e^";
    case "conj":
      return "z̄";
    default:
      return "???";
  }
};
