import { useMainGraph } from "@/model/store";
import { Node, NodeProps } from "reactflow";

export type InterfaceData = {[key: string]: never};
export type InterfaceNode = Node<InterfaceData>;
export type InterfaceProps = NodeProps<InterfaceData>;

export const BUFFER = 100

export const InterfaceNode = (props: InterfaceProps) => {
  const {editingCompositeData} = useMainGraph();
  console.log("InterfaceNode", editingCompositeData)
  if (editingCompositeData.isEditing === false) {
    throw new Error("InterfaceNode should only be rendered when editing a composite");
  }
  // const constraint = editingCompositeData.visibleCompositeEdge.constraint as CompositeOperation
  // const {interfaceVertexIds, layout} = constraint

  const {width, height} = props.data
  return <div className=" border-4 border-white rounded"
    style={{
      width: width,
      height: height,
    }}
  ></div>
}
