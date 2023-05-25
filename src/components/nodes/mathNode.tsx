import { OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { Math } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { BinopNode } from "./binop";
import { StandaloneNode } from "./standalone";
import { UnopNode } from "./unop";

export type MathData = Math["data"];
export type MathNode = Node<MathData>;
export type MathProps = NodeProps<MathData>;

export const MathNode = (props: MathProps) => {
  switch (props.data.opType) {
    case OP_TYPE.ADDER:
      return <BinopNode {...props} />;
    case OP_TYPE.MULTIPLIER:
      return <BinopNode {...props} />;
    case OP_TYPE.EXPONENTIAL:
      return <UnopNode {...props} />;
    case OP_TYPE.CONJUGATOR:
      return <UnopNode {...props} />;
    case OP_TYPE.STANDALONE:
      return <StandaloneNode {...props} />;
    case OP_TYPE.COMPOSITE:
      const arity = props.data.vertices.length - 1;
      switch (arity) {
        case 1:
          return <UnopNode {...props} />;
        case 2:
          return <BinopNode {...props} />;
        default:
          throw new Error(`Unsupported composite node arity: ${arity}`);
      }
    default:
      throw new Error(`Unknown node type: ${props.type}`);
  }
};
