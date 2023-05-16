import { logger } from "@/lib/logger";
import { NodeEdge, OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { settings } from "@/model/settings";
import { p } from "@/model/sketch";
import { mainGraph, useMainGraph } from "@/model/store";
import type { AddNode, Math } from "@/schema/node";
import { LockOpenIcon } from "@heroicons/react/20/solid";
import { useSnapshot } from "valtio";
import { Symbol } from "./symbol";

const Menubar = ({ activeNodes }: { activeNodes: Math[] }) => {
  const { focus } = useMainGraph();
  const reversing = !!focus;

  return (
    <div className="flex px-4 py-2 bg-slate-100">
      {reversing ? <ReversalMenu /> : <RegularMenu activeNodes={activeNodes} />}
    </div>
  );
};

const ReversalMenu = () => {
  return (
    <div className="grow flex space-x-4 pt-2 pb-3">
      <div>
        <p className="flex">
          Reversing: Click on a{" "}
          <div className="ring-offset-2 ring-4 ring-yellow-400 rounded-full mx-3">
            <LockOpenIcon className="w-6 h-6 text-slate-800" />
          </div>{" "}
          below to give up control of that number.
        </p>
      </div>
      <div>
        <button
          onClick={() => mainGraph.cancelReversal()}
          className="ml-auto rounded-xl bg-red-100 px-4 py-0.5 hover:bg-red-500"
        >
          Cancel Reversal
        </button>
      </div>
    </div>
  );
};

const RegularMenu = ({ activeNodes }: { activeNodes: Math[] }) => {
  const onDragStart = (event: React.DragEvent<HTMLElement>, addNode: AddNode) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(addNode));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <div className="flex space-x-4 ">
        <Draggable
          symbol="+"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.ADDER },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="*"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.MULTIPLIER },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="e^"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.EXPONENTIAL },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="z̄"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.CONJUGATOR },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="#"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "math",
              data: { opType: OP_TYPE.STANDALONE },
              position: { x: 0, y: 0 },
            })
          }
        />
        <Draggable
          symbol="Aa"
          onDragStart={(event: React.DragEvent<HTMLElement>) =>
            onDragStart(event, {
              type: "sticky",
              position: { x: 0, y: 0 },
            })
          }
        />
        {activeNodes.length > 0 && <NodeControls activeNodes={activeNodes} />}
      </div>
      <GlobalControls />
    </>
  );
};

const GlobalControls = () => {
  const { showDifferentials, stepSize } = useSnapshot(settings);

  const toggleShowDeltas = () => {
    settings.showDifferentials = !showDifferentials;
  };

  const updateStepSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseFloat(event.target.value);
    if (newSize > 0) {
      settings.stepSize = newSize;
    }
  };

  return (
    <div className="ml-auto flex space-x-2">
      <button
        onClick={toggleShowDeltas}
        className="rounded-xl bg-blue-100 px-4 py-0.5 hover:bg-blue-500"
      >
        {showDifferentials ? "Hide δs" : "Show δs"}
      </button>
      <div className="flex flex-col">
        <label htmlFor="stepsize">
          <span className="text-slate-800">Step Size</span>
        </label>
        <input
          id="stepsize"
          name="stepsize"
          type="number"
          step="0.001"
          value={stepSize}
          onChange={updateStepSize}
          className="rounded-xl bg-blue-100 px-4 py-0.5 w-28"
        />
      </div>
      <button
        onClick={() => mainGraph.reset()}
        className="ml-auto rounded-xl bg-red-100 px-4 py-0.5 hover:bg-red-500"
      >
        Erase All
      </button>
    </div>
  );
};

const NodeControls = ({ activeNodes }: { activeNodes: Math[] }) => {
  const hidden = activeNodes.every((node) => node.data.edge.hidden);
  const toggleHidden = () => {
    activeNodes.forEach((node) => {
      const edge = mainGraph._getEdge(node.id) as NodeEdge;
      edge.setHidden(!hidden);
    });
  };
  const centerLinkages = async () => {
    const boundingBox = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };
    logger.debug({ settings: JSON.stringify(settings) }, "settings");
    const numVertices = activeNodes.reduce((acc, node) => acc + node.data.vertices.length, 0);

    activeNodes.forEach((node) => {
      node.data.vertices.forEach((vertex) => {
        boundingBox.minX = Math.min(boundingBox.minX, vertex.value.x);
        boundingBox.maxX = Math.max(boundingBox.maxX, vertex.value.x);
        boundingBox.minY = Math.min(boundingBox.minY, vertex.value.y);
        boundingBox.maxY = Math.max(boundingBox.maxY, vertex.value.y);
      });
    });
    const xScale = p!.windowWidth / 2 / (boundingBox.maxX - boundingBox.minX);
    const yScale = (p!.windowHeight - 40) / (boundingBox.maxY - boundingBox.minY);
    const scale =
      numVertices < 2 ? settings.globalScale : Math.min(1100, Math.min(xScale, yScale) * 0.8);
    const xBuffer = p!.windowWidth / 2 - (boundingBox.maxX - boundingBox.minX) * scale;
    const yBuffer = p!.windowHeight - 40 - (boundingBox.maxY - boundingBox.minY) * scale;

    const newCenterX = 0 - boundingBox.minX * scale + xBuffer / 2;
    const newCenterY = p!.windowHeight - 40 + boundingBox.minY * scale - yBuffer / 2;

    const oldScale = settings.globalScale;
    const oldCenterX = settings.CENTER_X;
    const oldCenterY = settings.CENTER_Y;
    for (let i = 1; i <= 25; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      settings.CENTER_X = oldCenterX + (newCenterX - oldCenterX) * (i / 25);
      settings.CENTER_Y = oldCenterY + (newCenterY - oldCenterY) * (i / 25);
      settings.globalScale = oldScale + (scale - oldScale) * (i / 25);
    }
  };
  return (
    <div className="flex space-x-4">
      <button
        onClick={toggleHidden}
        className="rounded-xl bg-red-100 px-4 py-0.5 hover:bg-blue-100"
      >
        {hidden ? "Unhide" : "Hide"}
      </button>
      <button
        onClick={centerLinkages}
        className="rounded-xl bg-red-100 px-4 py-0.5 hover:bg-blue-100"
      >
        Center Selection
      </button>
    </div>
  );
};

const Draggable = ({
  onDragStart,
  symbol,
}: {
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
  symbol: string;
}) => {
  return (
    <div onDragStart={(event) => onDragStart(event)} draggable>
      <Symbol text={symbol} />
    </div>
  );
};

export default Menubar;
