import { OP_TYPE } from "@/model/coords/edges/nodeEdge";
import { BUILTIN_COMPOSITES } from "@/model/coords/operations/composites/compositeOperation";
import { mainGraph, useMainGraph } from "@/model/store";
import { AddNode } from "@/schema/node";
import useMeasure from "react-use-measure";
import { Button } from "./button";
import { Draggable } from "./draggable";

export const Sidebar = () => {
  const { focus } = useMainGraph();
  const reversing = !!focus;

  const [ref, bounds] = useMeasure();

  const { height } = bounds;

  return (
    <div className=" bg-slate-900 flex flex-col items-center " ref={ref}>
      <ComponentSidebar hidden={reversing} />
      {reversing && <ReversingSidebar height={height} />}
    </div>
  );
};

const ReversingSidebar = ({ height }: { height: number | undefined }) => {
  if (!height) return null;
  return (
    <div className="absolute" style={{ height: `${height}px` }}>
      <Button
        onClick={() => mainGraph.cancelReversal()}
        className="hover:bg-slate-700 h-full border-0"
      >
        Cancel Reversal
      </Button>
    </div>
  );
};

const ComponentSidebar = ({ hidden = false }: { hidden?: boolean }) => {
  const onDragStart = (event: React.DragEvent<HTMLElement>, addNode: AddNode) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(addNode));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={` ${hidden ? " blur-lg" : ""}`}>
      <div className="flex flex-col items-center">
        <p className="mt-2">Numbers</p>
        <div className={`grid grid-cols-1 gap-2 p-2`}>
          {" "}
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
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="mt-2">Basics</p>
        <div className={`grid grid-cols-2 gap-2 p-2`}>
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
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="mt-2">Specials</p>
        <div className={`grid grid-cols-1 gap-2 p-2`}>
          <Draggable
            symbol="-"
            onDragStart={(event: React.DragEvent<HTMLElement>) =>
              onDragStart(event, {
                type: "composite",
                data: { opType: BUILTIN_COMPOSITES.SUBTRACTOR },
                position: { x: 0, y: 0 },
              })
            }
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="mt-2">Notes</p>
        <div className={`grid grid-cols-1 gap-2 p-2`}>
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
      </div>
    </div>
  );
};
