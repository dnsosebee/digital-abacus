import { Binop } from "@/schema/node";
import { Handle, Node, NodeProps, Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { Symbol } from "../symbol";
import { NodeShell } from "./nodeShell";

export type BinopNodeData = Binop["data"];
export type BinopNode = Node<BinopNodeData>;
export type BinopProps = NodeProps<BinopNodeData>;

export const BinopNode = ({ data, selected }: BinopProps) => {
  return (
    <div>
      <Handle id="operand1" type="target" position={Position.Top} style={{ left: "25%" }} />
      <Handle id="operand2" type="target" position={Position.Top} style={{ left: "75%" }} />
      <NodeShell selected={selected}>
        <div className="flex flex-row space-x-5">
          <NumericInput value={data.operand1} readOnly={false} />
          <NumericInput value={data.operand2} readOnly={false} />
        </div>
        {/* <p className="pl-3 bold font-extrabold text-4xl">Unop Node</p>
        <p className="pl-3 font-extrabold text-2xl">{JSON.stringify(data)}</p> */}
        <Symbol text={getSymbol(data.operator)} />
        <NumericInput value={data.result} readOnly={true} />
      </NodeShell>
      <Handle id="result" type="source" position={Position.Bottom} />
    </div>
  );
};

const getSymbol = (operator: Binop["data"]["operator"]): string => {
  switch (operator) {
    case "add":
      return "+";
    case "mult":
      return "*";
    default:
      return "???";
  }
};
