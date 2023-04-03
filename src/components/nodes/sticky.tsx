import { updateStickyText } from "@/model/store";
import { Sticky } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { NodeShell } from "./nodeShell";

export type StickyNodeData = Sticky["data"];
export type StickyNode = Node<StickyNodeData>;
export type StickyProps = NodeProps<StickyNodeData>;

export const StickyNode = ({ data, selected, id }: StickyProps) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateStickyText(id, e.target.value);
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
