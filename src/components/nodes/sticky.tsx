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
      <NodeShell selected={selected} className="rounded-3xl px-4">
        <h1 className="text-2xl">✍️</h1>
        <textarea
          className="w-full h-full block rounded-xl border-0 py-1.5 bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-2 resize-none"
          value={data.text}
          onChange={onChange}
        />
      </NodeShell>
    </div>
  );
};
