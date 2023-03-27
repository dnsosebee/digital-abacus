import { handleNumToId } from "@/schema/handle";
import { Handle, HandleProps, Position } from "reactflow";

export const DualHandle = (
  props: Omit<HandleProps, "id" | "type"> & { bound: boolean; idx: number } & {
    style?: React.CSSProperties;
    position?: Position;
  }
) => {
  return (
    <>
      <Handle
        id={handleNumToId(props.idx, true)}
        type="source"
        {...props}
        className={props.bound ? "" : "invisible"}
      />
      <Handle
        id={handleNumToId(props.idx, false)}
        type="target"
        {...props}
        className={props.bound ? "invisible" : ""}
      />
    </>
  );
};
