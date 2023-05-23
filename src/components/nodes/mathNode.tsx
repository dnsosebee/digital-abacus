import { EffectiveOperation } from "@/model/solver/operation/node/effectives/effective";
import { Math } from "@/schema/node";
import { Node, NodeProps } from "reactflow";
import { BinopNode } from "./binop";
import { StandaloneNode } from "./standalone";
import { UnopNode } from "./unop";

export type MathData = Math["data"];
export type MathNode = Node<MathData>;
export type MathProps = NodeProps<MathData>;

export const MathNode = (props: MathProps) => {
  const { operation } = props.data as { operation: EffectiveOperation };

  if (operation.isPrimitive) {
    switch (operation.opType) {
      case "adder":
        return <BinopNode {...props} />;
      case "multiplier":
        return <BinopNode {...props} />;
      case "exponential":
        return <UnopNode {...props} />;
      case "conjugator":
        return <UnopNode {...props} />;
      case "standalone":
        return <StandaloneNode {...props} />;
      default:
        throw new Error(`Unknown primitive node type: ${props.type}`);
    }
  } else {
    throw new Error(`composite nodes not yet supported`);
  }
};
