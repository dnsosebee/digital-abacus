import { logger as parentLogger } from "@/lib/logger";
import {
  SerialState,
  addNode,
  addWire,
  changeSelection,
  cloneSelected,
  removeNode,
  removeWire,
  updateNodePosition,
  useMainGraph,
} from "@/model/store";
import { AddNode, Math } from "@/schema/node";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
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
import Menubar from "./menubar";
import { MathNode } from "./nodes/mathNode";
import { StickyNode } from "./nodes/sticky";

const logger = parentLogger.child({ component: "CircuitBoard" });

const NODE_COMPONENTS = {
  math: MathNode,
  sticky: StickyNode,
};

const EDGE_TYPES = {
  coord: SmartBezierEdge,
  // TODO: add LIST edge types
};

const CircuitBoard = ({ serialState }: { serialState: SerialState }) => {
  const { nodes, wires } = useMainGraph(serialState);
  // const updateNodeInternals = useUpdateNodeInternals();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<any>(null);

  // logger.debug({ dragging, nodes, wires }, "CircuitBoard");

  // useEffect(() => {
  //   if (shouldUpdateNodeInternals) {
  //     nodes.forEach((node) => {
  //       updateNodeInternals(node.id);
  //     });
  //     registerNodeInternalsUpdated();
  //   }
  // }, [shouldUpdateNodeInternals]);

  const [copyRequested, setCopyRequested] = useState(false);
  const [copied, setCopied] = useState(false);
  const altPressed = useKeyPress("Alt");
  // console.log("altPressed", altPressed);
  // console.log("copied", copied);
  useEffect(() => {
    if (!altPressed) {
      setCopyRequested(false);
      setCopied(false);
    }
    if (altPressed && copyRequested) {
      cloneSelected();
      setCopied(true);
    }
  }, [altPressed, copyRequested]);

  const onNodesChange: OnNodesChange = useCallback(
    // @ts-ignore
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        switch (change.type) {
          case "position":
            if (altPressed && !copied) {
              if (!copyRequested) {
                setCopyRequested(true);
              }
              // we wait until clone is finished to update position
              return;
            }
            updateNodePosition(change);
            break;
          case "remove":
            removeNode(change.id);
            break;
          case "select":
            changeSelection(change.id, change.selected);
            break;
          default:
            console.log("unhandled node change", change);
        }
      });
    },
    [altPressed, copyRequested, copied]
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
          case "select":
            changeSelection(change.id, change.selected);
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

  const activeNodes = nodes.filter((node) => node.selected);
  const activeMathNodes = activeNodes.filter((node) => node.type === "math") as Math[];
  // logger.debug({ activeNodes }, "activeNodes");

  return (
    <div className="flex-grow flex flex-col">
      <Menubar activeNodes={activeMathNodes} />
      <div className="flex-grow flex flex-col items-stretch">
        {/* <p>{store.edges.length}</p> */}
        {/* <CircuitsProvider altPressed={altPressed} copied={copied}> */}
        <div className="reactflow-wrapper flex-grow" ref={reactFlowWrapper}>
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
            // onConnectStart={() => setDragging(true)}
            // onConnectEnd={() => setDragging(false)}
            connectionMode={ConnectionMode.Loose}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        {/* </CircuitsProvider> */}
      </div>
    </div>
  );
};

export default CircuitBoard;

function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}
