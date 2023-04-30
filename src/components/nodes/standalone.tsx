import { updateLabel } from "@/model/store";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const StandaloneNode = ({ data, selected, id }: MathProps) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLabel(id, e.target.value);
  };

  return (
    <div>
      <DualHandle idx={0} bound={data.vertices[0].isBound()} position={Position.Bottom} />
      <NodeShell row={false} selected={selected}>
        <input
          type="text"
          name="label"
          id="label"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
          placeholder="label"
          value={data.label}
          onChange={handleLabelChange}
        />
        <NumericInput vertex={data.vertices[0]} />
      </NodeShell>
    </div>
  );
};
