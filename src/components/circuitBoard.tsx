import { logger as parentLogger } from "@/lib/logger";
import {
  addNode,
  addWire,
  removeNode,
  removeWire,
  updateNodePosition,
  useNodesAndEdges,
} from "@/model/store";
import { AddNode } from "@/schema/node";
import { useCallback, useRef, useState } from "react";
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
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { CircuitsProvider } from "./circuitsProvider";
import { MathNode } from "./nodes/mathNode";
import { StickyNode } from "./nodes/sticky";
import Sidebar from "./sidebar";

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
  const { shouldUpdateNodeInternals, nodes, wires } = useNodesAndEdges();
  // const updateNodeInternals = useUpdateNodeInternals();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<any>(null);

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
          case "remove":
            removeNode(change.id);
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
          case "remove":
            removeWire(change.id);
            break;
          default:
            console.log("unhandled wire change", change);
        }
      }),
    []
  );

  const onConnect: OnConnect = useCallback((connection: Connection) => addWire(connection), []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        throw new Error("reactFlowWrapper.current is null");
      }
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect() as DOMRect;
      const addNodeData = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      ) as AddNode;

      // check if the dropped element is valid
      if (typeof addNodeData === "undefined" || !addNodeData) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      addNode({ ...addNodeData, position });
    },
    [reactFlowInstance]
  );

  return (
    <>
      <Sidebar />
      <div className="h-full grow">
        {/* <p>{store.edges.length}</p> */}
        <CircuitsProvider dragging={dragging}>
          <div className="reactflow-wrapper h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              onNodesChange={onNodesChange}
              edges={wires}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={NODE_COMPONENTS}
              edgeTypes={EDGE_TYPES}
              onInit={setReactFlowInstance}
              onConnectStart={() => setDragging(true)}
              onConnectEnd={() => setDragging(false)}
              connectionMode={ConnectionMode.Loose}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </CircuitsProvider>
      </div>
    </>
  );
};

export default CircuitBoard;
