// import { Edge, EdgeProps, getSmoothStepPath } from "reactflow";

import SmartBezierEdge from "@tisoap/react-flow-smart-edge";

// export type WireEdge = Edge & { sourceHandle: string; targetHandle: string };
// export type WireEdgeProps = EdgeProps;

// export const WireEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   markerEnd = "arrow",
//   interactionWidth = 5,
// }: WireEdgeProps) => {
//   const [path] = getSmoothStepPath({
//     sourceX,
//     sourceY: sourceY - 8,
//     sourcePosition,
//     targetX,
//     targetY: targetY + 10,
//     targetPosition,
//     borderRadius: 20,
//   });

//   return (
//     <>
//       <path
//         id={id}
//         style={{ ...style, strokeWidth: 1.5, strokeLinecap: "butt", stroke: "#0EA5E9" }}
//         className="react-flow__edge-path animated"
//         d={path}
//         markerEnd={markerEnd}
//       />
//       {interactionWidth && (
//         <path d={path} fill="none" strokeOpacity={0} strokeWidth={interactionWidth} />
//       )}
//     </>
//   );
// };

export const WireView = (props: any) => {
  const styles = {
    strokeWidth: 5,
    stroke: props.selected ? "#93c5fd" : "#e2e2e2",
  };
  return <SmartBezierEdge {...props} style={styles} />;
};
