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
  useStore
} from "@/model/store";
import { AddNode, Math as MathSchema } from "@/schema/node";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  EdgeChange,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  SelectionMode
} from "reactflow";
import "reactflow/dist/style.css";
import { Navbar } from "./navbar";
import { InterfaceNode } from "./nodes/interfaceNode";
import { MathNode } from "./nodes/mathNode";
import { MultiSelectionToolbar } from "./nodes/multiSelectionToolbar";
import { StickyNode } from "./nodes/sticky";
import { WireView } from "./wires/wire";

const logger = parentLogger.child({ component: "CircuitBoard" });

const NODE_COMPONENTS = {
  math: MathNode,
  sticky: StickyNode,
  interface: InterfaceNode,
};

const EDGE_TYPES = {
  coord: WireView,
  // TODO: add LIST edge types
};

const CircuitBoard = ({ serialState }: { serialState: SerialState }) => {
  const { nodes, wires, encapsulatedNodes} = useStore(serialState);
  // const updateNodeInternals = useUpdateNodeInternals();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<any>(null);
  const [midSelection, setMidSelection] = useState(false);

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

  // useEffect(() => {
  //   if (!editingCompositeDataSnap.isEditing) return;
  //   if (reactFlowInstance && reactFlowInstance) {
  //     const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect() as DOMRect;

  //     const boundingRect = getBoundingRectangleForClassName("nodeshell");
  //     console.log("boundingRect", boundingRect)
  //     if (!boundingRect) return;
  //     const rFTopLeft = reactFlowInstance.project({
  //       x: boundingRect.left - reactFlowBounds.left,
  //       y: boundingRect.top - reactFlowBounds.top,
  //     });
  //     const rFBottomRight = reactFlowInstance.project({
  //       x: boundingRect.right - reactFlowBounds.left,
  //       y: boundingRect.bottom - reactFlowBounds.top,
  //     });
  //     const rFWidth = rFBottomRight.x - rFTopLeft.x;
  //     const rFHeight = rFBottomRight.y - rFTopLeft.y;

  //     if (!editingCompositeData.isEditing) {
  //       throw new Error("editingCompositeData.isEditing should be true");
  //     }
  //     const { interfaceNodeDimensions } = editingCompositeData;

  //     interfaceNodeDimensions.x = rFTopLeft.x
  //     interfaceNodeDimensions.y = rFTopLeft.y
  //     interfaceNodeDimensions.width = rFWidth
  //     interfaceNodeDimensions.height = rFHeight
  //   }
  // }, [nodes, reactFlowInstance, editingCompositeDataSnap.isEditing]);

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

  const selectedNodes = nodes
    .filter((node) => node.selected)
    .filter((node) => node.type === "math") as MathSchema[];
  // logger.debug({ activeNodes }, "activeNodes");

  return (
    <div className={`flex-grow flex flex-col ${encapsulatedNodes && 'encapsulating'}`}>
      <div className="flex-grow flex flex-col items-stretch">
        {/* <p>{store.edges.length}</p> */}
        {/* <CircuitsProvider altPressed={altPressed} copied={copied}> */}
        <div className="reactflow-wrapper flex-grow" ref={reactFlowWrapper}>
          <Navbar />
          <ReactFlow
            className="spotlight"
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
            onSelectionStart={() => setMidSelection(true)}
            onSelectionEnd={() => setMidSelection(false)}
            // panOnScroll
            // selectionOnDrag
            // panOnDrag={[1, 2]}
            selectionMode={SelectionMode.Partial}
            multiSelectionKeyCode={"Shift"}
            selectionKeyCode={"Shift"}
            // onConnectStart={() => setDragging(true)}
            // onConnectEnd={() => setDragging(false)}
            connectionMode={ConnectionMode.Loose}
            connectionLineType={ConnectionLineType.Straight}
          >
            <Background />
            <Controls />
            {!midSelection && <MultiSelectionToolbar selectedNodes={selectedNodes} />}
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

