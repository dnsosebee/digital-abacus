import { isBound } from "@/src2/model/graph/operation/node/effectives/effective";
import { Standalone } from "@/src2/model/graph/operation/node/effectives/primitives/standalone";
import { getOperation } from "@/src2/model/useStore";
import { Position } from "reactflow";
import { NumericInput } from "../numericInput";
import { DualHandle } from "./dualHandle";
import { MathProps } from "./mathNode";
import { NodeShell } from "./nodeShell";

export const StandaloneNode = ({ data, selected }: MathProps) => {
  const {
    operation: { exposedVertices, label, id },
  } = data as { operation: Standalone };
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    (getOperation(id)! as Standalone).label = e.target.value;
  };

  return (
    <div>
      <DualHandle idx={0} bound={isBound(exposedVertices[0])} position={Position.Bottom} />
      <NodeShell row={false} selected={selected}>
        <input
          type="text"
          name="label"
          id="label"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
          placeholder="label"
          value={label}
          onChange={handleLabelChange}
        />
        <NumericInput vertex={exposedVertices[0]} id={{ operationId: id, index: 0 }} wide />
      </NodeShell>
    </div>
  );
};
