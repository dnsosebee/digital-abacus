import { logger as parentLogger } from "@/lib/logger";
import { useGraph } from "@/model/store";
import { useCallback } from "react";
import ReactFlow, { Background, BezierEdge, Controls, NodeChange, OnNodesChange } from "reactflow";
import "reactflow/dist/style.css";
import { MathNode } from "./nodes/mathNode";

const logger = parentLogger.child({ component: "CircuitBoard" });

const NODE_COMPONENTS = {
  math: MathNode,
};

const EDGE_TYPES = {
  value: BezierEdge,
  // TODO: add LIST edge types
};

const CircuitBoard = () => {
  // const [nodes, setNodes] = useState<CircuitNode[]>(INITIAL_NODES);
  // const [wires, setWires] = useState<Wire[]>(INITIAL_WIRES);
  const { nodes, wires, updateNodePosition } = useGraph();

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
  // const onEdgesChange: OnEdgesChange = useCallback(
  //   (changes) => setWires((eds) => applyEdgeChanges(changes, eds) as Wire[]),
  //   []
  // );

  // const onConnect: OnConnect = useCallback(
  //   (params) => setWires((eds) => addEdge(params, eds) as Wire[]),
  //   []
  // );

  return (
    <div className="h-full grow">
      {/* <p>{store.edges.length}</p> */}
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={wires}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        nodeTypes={NODE_COMPONENTS}
        edgeTypes={EDGE_TYPES}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CircuitBoard;
