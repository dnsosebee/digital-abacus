import { CompositeOperation } from "@/model/coords/operations/composites/compositeOperation";
import { activeCompositeEdge, interfaceNodeDimensions } from "@/model/store";
import { Node, NodeProps } from "reactflow";
import { useSnapshot } from "valtio";

export type InterfaceData = {[key: string]: never};
export type InterfaceNode = Node<InterfaceData>;
export type InterfaceProps = NodeProps<InterfaceData>;

export const BUFFER = 100

export const InterfaceNode = (props: InterfaceProps) => {
  const {constraint} = useSnapshot(activeCompositeEdge) as unknown as {constraint: CompositeOperation};
  const {interfaceVertexIds, layout} = constraint

  const {width, height} = useSnapshot(interfaceNodeDimensions)
  return <div className=" border-4 border-white rounded"
    style={{
      width: width + BUFFER * 2,
      height: height + BUFFER * 2,
    }}
  ></div>
}
