import { Handle, HandleProps } from "reactflow";

export const DualHandle = (
  props: Omit<HandleProps, "id" | "type"> & { bound: boolean; idx: number } & {
    style?: React.CSSProperties;
  }
) => {
  return (
    <>
      <Handle id={handleId(props.idx, true)} type="source" {...props} />
      {!props.bound && (
        <Handle id={handleId(props.idx, false)} type="target" {...props} className="hidden" />
      )}
    </>
  );
};

export const handleId = (idx: number, source: boolean) => {
  return `${source ? "source" : "target"}-${idx}`;
};
