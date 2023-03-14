import type { Value } from "@/schema/node";

export type NumericInputProps = {
  value: Value;
  readOnly: boolean;
};

export const NumericInput = (props: NumericInputProps) => {
  return (
    <div className="nodrag">
      <input
        type="number"
        value={props.value.x}
        onChange={(e) => console.log(e.target.value)}
        readOnly={props.readOnly}
        className="w-16 text-lg font-bold rounded-lg px-1 border border-slate-300"
      />
    </div>
  );
};
