import { OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { CompositeOperation } from "@/model/coords/operations/composites/compositeOperation";
import { Math } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { BigNode } from "./big";
import { ConstantNode } from "./constant";
import { StandaloneNode } from "./standalone";
import { TopAndBottomNode } from "./topAndBottom";
import { UnopNode } from "./unop";

export type MathData = Math["data"];
export type MathNode = Node<MathData>;
export type MathProps = NodeProps<MathData>;

export const MathNode = (props: MathProps) => {
  switch (props.data.opType) {
    case OP_TYPE.ADDER:
      return <BigNode {...props} />;
    case OP_TYPE.MULTIPLIER:
      return <BigNode {...props} />;
    case OP_TYPE.EXPONENTIAL:
      return <UnopNode {...props} />;
    case OP_TYPE.CONJUGATOR:
      return <UnopNode {...props} />;
    case OP_TYPE.STANDALONE:
      return <StandaloneNode {...props} />;
    case OP_TYPE.COMPOSITE:
      const layout = (props.data.edge.constraint as unknown as CompositeOperation).layout;
      if (layout) {
        switch (layout.type) {
          case "topAndBottom":
            return <TopAndBottomNode selected={props.selected} edge={props.data.edge} />;
          default:
            throw new Error(`Unknown composite node layout: ${layout}`);
        }
      }
      const arity = props.data.vertices.length - 1;
      switch (arity) {
        case 0:
          return <ConstantNode {...props} />;
        case 1:
          return <UnopNode {...props} />;
        case 2:
        case 3:
        case 4:
          return <BigNode {...props} />;
        default:
          console.warn(props.data.edge.constraint);
          throw new Error(`Unsupported composite node arity: ${arity}`);
      }
    default:
      throw new Error(`Unknown node type: ${props.type}`);
  }
};
