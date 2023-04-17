import { OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { mainGraph } from "@/model/store";
import { AddNode } from "@/schema/node";
import { Symbol } from "./symbol";

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent<HTMLElement>, addNode: AddNode) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(addNode));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex px-4 py-2  bg-slate-100">
      <div className="flex space-x-8 ">
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

export default Sidebar;
