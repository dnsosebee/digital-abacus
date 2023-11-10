import { CoordGraph } from "@/model/coords/coordGraph";
import { CompositeOperation } from "@/model/coords/operations/composites/compositeOperation";
import { isEditingComposite, store, useStore } from "@/model/store";
import { Node, NodeProps, Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { DualHandle } from "./dualHandle";

export type InterfaceData = { [key: string]: never };
export type InterfaceNode = Node<InterfaceData>;
export type InterfaceProps = NodeProps<InterfaceData>;

export const BUFFER = 150;

export const InterfaceNode = (props: InterfaceProps) => {
  if (isEditingComposite() === false) {
    console.warn("InterfaceNode should only be rendered when editing a composite");
    return null;
  }

  switch (props.id) {
    case "left":
      return <Wall height={props.data.height} />;
    case "right":
      return <Wall height={props.data.height} right/>;
    case "top":
      return <Interface width={props.data.width} top={0} />;
    case "bottom":
      return <Interface width={props.data.width + 10} top={props.data.height} />;
    default:
      throw new Error("Invalid interface node id");
  }
};

const Wall = ({ height, right = false}: { height: number, right?: boolean }) => {
  return <div className="bg-white" style={{ height, width: 10 }} />;
};

const Interface = ({ width, top }: { width: number; top: number }) => {
  const { ancestors } = useStore();
  if (ancestors.length === 0) {
    console.warn("InterfaceNode should only be rendered when editing a composite");
    return null;
  }
  const { graph: parentGraph, node } = store.ancestors[store.ancestors.length - 1];
  const isTop = top === 0;

  const compositeOperation = node.constraint as CompositeOperation;
  const { top: topVertices, bottom: bottomVertices } = compositeOperation.layout!.data;
  const vertices = node.vertices;
  const relevantVertices = isTop ? topVertices : bottomVertices;
  console.log({ relevantVertices, topVertices, bottomVertices, vertices });

  return (
    <div>
      <div className="bg-white p-4 flex flex-row space-x-5 justify-evenly" style={{ width }}>
        {relevantVertices.map((idx) => (
          <div className="visible relative" key={`vertex-${idx}`}>
            <NumericInput key={idx} vertex={vertices[idx]} graph={parentGraph as CoordGraph} />
          </div>
        ))}
      </div>
      {relevantVertices.map((idx, layoutIdx) => (
        <DualHandle
          key={idx}
          idx={layoutIdx}
          bound={vertices[idx].isBound()}
          position={isTop ? Position.Bottom : Position.Top}
          style={{
            left: `${(100 / relevantVertices.length) * (0.5 + layoutIdx)}%`,
            [isTop ? "bottom" : "top"]: `-15px`,
          }}
        />
      ))}
    </div>
  );
};
