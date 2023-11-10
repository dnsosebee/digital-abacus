import { handleNumToId } from "@/schema/handle";
import { Handle, HandleProps, Position } from "reactflow";

export const DualHandle = (
  props: Omit<HandleProps, "id" | "type"> & { bound: boolean; idx: number } & {
    style?: React.CSSProperties;
    position?: Position;
  }
) => {
  return (
    <Handle
      id={handleNumToId(props.idx)}
      type="source"
      style={props.style}
      position={props.position}
      className={`${props.bound ? "bound" : ""} visible`}
      isConnectableEnd={!props.bound}
    />
  );
};
