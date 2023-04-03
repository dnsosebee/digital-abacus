import { logger } from "@/lib/logger";
import { handleNumToId } from "@/schema/handle";
import { Handle, HandleProps, Position } from "reactflow";
import { useCircuits } from "../circuitsProvider";

export const DualHandle = (
  props: Omit<HandleProps, "id" | "type"> & { bound: boolean; idx: number } & {
    style?: React.CSSProperties;
    position?: Position;
  }
) => {
  const { dragging } = useCircuits();
  logger.debug({ dragging }, "DualHandle");
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
