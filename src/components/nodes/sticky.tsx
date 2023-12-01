import { updateStickyJson } from "@/model/store";
import { Sticky } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { Tiptap } from "../richTextEditor";
import { NodeShell } from "./nodeShell";

export type StickyNodeData = Sticky["data"];
export type StickyNode = Node<StickyNodeData>;
export type StickyProps = NodeProps<StickyNodeData>;

export const StickyNode = ({ data, selected, id }: StickyProps) => {
  // const [stickyText, setStickyText] = useState(data.text);

  // useEffect(() => {
  //   setStickyText(data.text);
  // }, [data.text]);

  // const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setStickyText(e.target.value);
  //   updateStickyText(id, e.target.value);
  // };

  // updateStickyDimensions("todo", {})

  const handleDrag = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("dragging");
  };

  const updateJson = (json: any) => {
    console.log({json})
    updateStickyJson(id, json)
  }

  return (
    <div>
      <NodeShell selected={selected} className="rounded-3xl px-4 prose font-sans" id={id}>
        <div className="self-stretch draggable flex items-center justify-center"><h1 className="text-2xl ">✍️</h1></div>
        {/* <textarea
          className="textarea textarea-bordered"
          style={{ width: data.width, height: data.height }}
          placeholder="Enter text here..."
          value={stickyText}
          onChange={onChange}
          onc
        /> */}
        <Tiptap updateJson={updateJson} initialJson={data.tiptapJson} />
      </NodeShell>
    </div>
  );
};
