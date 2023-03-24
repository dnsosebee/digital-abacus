import { OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { Math } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { BinopNode } from "./binop";
import { StandaloneNode } from "./equals";
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
    default:
      throw new Error(`Unknown node type: ${props.type}`);
  }
};
