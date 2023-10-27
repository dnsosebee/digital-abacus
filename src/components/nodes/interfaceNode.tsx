import { CompositeOperation } from "@/model/coords/operations/composites/compositeOperation";
import { editingCompositeData } from "@/model/store";
import { Node, NodeProps } from "reactflow";
import { useSnapshot } from "valtio";

export type InterfaceData = {[key: string]: never};
export type InterfaceNode = Node<InterfaceData>;
export type InterfaceProps = NodeProps<InterfaceData>;

export const BUFFER = 100

export const InterfaceNode = (props: InterfaceProps) => {
  const editingData = useSnapshot(editingCompositeData);
  if (editingData.isEditing === false) {
    throw new Error("InterfaceNode should only be rendered when editing a composite");
  }
  const constraint = editingData.visibleCompositeEdge.constraint as CompositeOperation
  const {interfaceVertexIds, layout} = constraint

  const {width, height} = editingData.interfaceNodeDimensions
  return <div className=" border-4 border-white rounded"
    style={{
      width: width + BUFFER * 2,
      height: height + BUFFER * 2,
    }}
  ></div>
}
