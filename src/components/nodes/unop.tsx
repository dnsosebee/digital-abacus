import { Unop } from "@/schema/node";
import { Handle, Node, NodeProps, Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { NodeShell } from "./nodeShell";

export type UnopNodeData = Unop["data"];
export type UnopNode = Node<UnopNodeData>;
export type UnopProps = NodeProps<UnopNodeData>;

export const UnopNode = ({ data, selected }: UnopProps) => {
  return (
    <div>
      <Handle id="operand" type="target" position={Position.Top} />
      <NodeShell selected={selected}>
        <NumericInput value={data.operand} readOnly={false} />
        {/* <p className="pl-3 bold font-extrabold text-4xl">Unop Node</p>
        <p className="pl-3 font-extrabold text-2xl">{JSON.stringify(data)}</p> */}
        <Symbol text={getSymbol(data.operator)} />
        <NumericInput value={data.result} readOnly={true} />
      </NodeShell>
      <Handle id="result" type="source" position={Position.Bottom} />
    </div>
  );
};

const getSymbol = (operator: Unop["data"]["operator"]): string => {
  switch (operator) {
    case "exp":
      return "e^";
    case "conj":
      return "z̄";
    default:
      return "???";
  }
};
