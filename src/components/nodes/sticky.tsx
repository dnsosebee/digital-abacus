import { updateStickyText } from "@/model/store";
import { Sticky } from "@/schema/node";
import { useEffect, useState } from "react";
import { Node, NodeProps } from "reactflow";
import { NodeShell } from "./nodeShell";

export type StickyNodeData = Sticky["data"];
export type StickyNode = Node<StickyNodeData>;
export type StickyProps = NodeProps<StickyNodeData>;

export const StickyNode = ({ data, selected, id }: StickyProps) => {
  const [stickyText, setStickyText] = useState(data.text);

  useEffect(() => {
    setStickyText(data.text);
  }, [data.text]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStickyText(e.target.value);
    updateStickyText(id, e.target.value);
  };

  // updateStickyDimensions("todo", {})

  const handleDrag = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("dragging");
  };

  return (
    <div>
      <NodeShell selected={selected} className="rounded-3xl px-4" id={id}>
        <h1 className="text-2xl draggable">✍️</h1>
        <textarea
          className=""
          placeholder="Enter text here..."
          value={stickyText}
          onChange={onChange}
          onDrag={handleDrag}
        />
      </NodeShell>
    </div>
  );
};
