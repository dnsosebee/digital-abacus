import { Sticky as RFSticky } from "@/schema/node";
import { Sticky } from "@/src2/model/solver/operation/node/sticky";
import { getCurrentGraph } from "@/src2/model/useStore";
import { Node, NodeProps } from "reactflow";
import { NodeShell } from "./nodeShell";

export type StickyNodeData = RFSticky["data"];
export type StickyNode = Node<StickyNodeData>;
export type StickyProps = NodeProps<StickyNodeData>;

export const StickyNode = ({ data, selected, id }: StickyProps) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    (getCurrentGraph().operation.implementation.find((op) => op.id === id)! as Sticky).label =
      e.target.value;
  };

  return (
    <div>
      <NodeShell selected={selected}>
        <h1 className="text-2xl">✍️</h1>
        <textarea
          className="w-full h-full p-2 nodrag border border-slate-300 rounded-lg"
          value={data.text}
          onChange={onChange}
        />
      </NodeShell>
    </div>
  );
};
