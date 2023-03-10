import { INITIAL_EDGES, INITIAL_NODES } from "@/lib/data/initialData";
import { CircuitNode } from "@/schema/node";
import { Wire } from "@/schema/wire";
import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { UnopNode } from "./nodes/unop";
import { ValueNode } from "./nodes/value";
import { WireEdge } from "./wires/wire";

const NODE_TYPES = {
  value: ValueNode,
  unop: UnopNode,
};

const EDGE_TYPES = {
  value: WireEdge,
  // TODO: add LIST edge types
};

const CircuitBoard = () => {
  const [nodes, setNodes] = useState<CircuitNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Wire[]>(INITIAL_EDGES);

  const onNodesChange: OnNodesChange = useCallback(
    // @ts-ignore
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds) as CircuitNode[]),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds) as Wire[]),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds) as Wire[]),
    []
  );

  return (
    <div className="h-full grow">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
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
