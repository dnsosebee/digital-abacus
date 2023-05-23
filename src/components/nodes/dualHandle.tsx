import { handleNumToId } from "@/model/solver/operation/node/node";
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
      className={`${props.bound ? "bound" : ""}`}
      isConnectableEnd={!props.bound}
    />
  );
};
