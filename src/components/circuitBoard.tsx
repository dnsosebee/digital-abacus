import { INITIAL_EDGES as INITIAL_WIRES, INITIAL_NODES } from "@/lib/data/initialData";
import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BezierEdge,
  Controls,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { BinopNode } from "./nodes/binop";
import { EqualsNode } from "./nodes/equals";
import { StickyNode } from "./nodes/sticky";
import { UnopNode } from "./nodes/unop";

const NODE_TYPES = {
  value: EqualsNode,
  unop: UnopNode,
  binop: BinopNode,
  sticky: StickyNode,
};

const EDGE_TYPES = {
  value: BezierEdge,
  // TODO: add LIST edge types
};

const CircuitBoard = () => {
  const [nodes, setNodes] = useState<CircuitNode[]>(INITIAL_NODES);
  const [wires, setWires] = useState<Wire[]>(INITIAL_WIRES);

  const onNodesChange: OnNodesChange = useCallback(
    // @ts-ignore
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds) as CircuitNode[]),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setWires((eds) => applyEdgeChanges(changes, eds) as Wire[]),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setWires((eds) => addEdge(params, eds) as Wire[]),
    []
  );

  return (
    <div className="h-full grow">
      {/* <p>{store.edges.length}</p> */}
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={wires}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CircuitBoard;
