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
      <DualHandle
        idx={0}
        bound={data.vertices[0].isBound()}
        position={Position.Bottom}
        style={{ bottom: "-12px" }}
      />
      <NodeShell row={false} selected={selected} className="round-standalone px-3">
        <input
          type="text"
          name="label"
          id="label"
          className="block w-full rounded-lg border-0 py-1.5 bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-2"
          placeholder="number label"
          value={data.label}
          onChange={handleLabelChange}
        />
        <NumericInput vertex={data.vertices[0]} wide />
      </NodeShell>
    </div>
  );
};
