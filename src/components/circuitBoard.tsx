import { logger as parentLogger } from "@/lib/logger";
import { addWire, updateNodePosition, useGraph } from "@/model/store";
import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  BezierEdge,
  Connection,
  ConnectionMode,
  Controls,
  EdgeChange,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  useUpdateNodeInternals,
} from "reactflow";
import "reactflow/dist/style.css";
import { CircuitsProvider } from "./circuitsProvider";
import { MathNode } from "./nodes/mathNode";
import { StickyNode } from "./nodes/sticky";

const logger = parentLogger.child({ component: "CircuitBoard" });

const NODE_COMPONENTS = {
  math: MathNode,
  sticky: StickyNode,
};

const EDGE_TYPES = {
  coord: BezierEdge,
  // TODO: add LIST edge types
};

const CircuitBoard = () => {
  const { shouldUpdateNodeInternals, nodes, wires } = useGraph();
  const updateNodeInternals = useUpdateNodeInternals();
  const [dragging, setDragging] = useState(false);
  logger.debug({ dragging }, "CircuitBoard");

  // useEffect(() => {
  //   if (shouldUpdateNodeInternals) {
  //     nodes.forEach((node) => {
  //       updateNodeInternals(node.id);
  //     });
  //     registerNodeInternalsUpdated();
  //   }
  // }, [shouldUpdateNodeInternals]);

  const onNodesChange: OnNodesChange = useCallback(
    // @ts-ignore
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        switch (change.type) {
          case "position":
            updateNodePosition(change);
            break;
          default:
            console.log("unhandled node change", change);
        }
      });
    },
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      changes.forEach((change) => {
        switch (change.type) {
          case "add":
            addWire(change.item as Connection);
            break;
          default:
            console.log("unhandled wire change", change);
        }
      }),
    []
  );

  const onConnect: OnConnect = useCallback((connection: Connection) => addWire(connection), []);

  return (
    <div className="h-full grow">
      {/* <p>{store.edges.length}</p> */}
      <CircuitsProvider dragging={dragging}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={wires}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={NODE_COMPONENTS}
          edgeTypes={EDGE_TYPES}
          onConnectStart={() => setDragging(true)}
          onConnectEnd={() => setDragging(false)}
          connectionMode={ConnectionMode.Loose}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </CircuitsProvider>
    </div>
  );
};

export default CircuitBoard;
