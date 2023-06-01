import { OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { Math } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { BigNode } from "./big";
import { ConstantNode } from "./constant";
import { StandaloneNode } from "./standalone";
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
      const arity = props.data.vertices.length - 1;
      switch (arity) {
        case 0:
          console.log(props.data);
          return <ConstantNode {...props} />;
        case 1:
          console.log(props.data);
          return <UnopNode {...props} />;
        case 2:
        case 3:
        case 4:
          return <BigNode {...props} />;
        default:
          throw new Error(`Unsupported composite node arity: ${arity}`);
      }
    default:
      throw new Error(`Unknown node type: ${props.type}`);
  }
};
