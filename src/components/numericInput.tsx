import { VertexInfo } from "@/schema/node";

export const NumericInput = (props: VertexInfo) => {
  return (
    <div className="nodrag">
      <input
        type="number"
        value={props.coord.x}
        onChange={(e) => console.log(e.target.value)}
        readOnly={props.bound}
        className="w-16 text-lg font-bold rounded-lg px-1 border border-slate-300"
      />
    </div>
  );
};
