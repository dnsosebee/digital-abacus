import { EffectiveOperation } from "@/model/solver/operation/node/effectives/effective";
import { Coord } from "@/model/solver/operation/vertex/coord";
import { VertexId } from "@/model/solver/operation/vertex/vertex";
import { getCurrentGraph } from "@/model/useStore";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type BeginDrag = (vertexId: VertexId, initialX: number, initialCoord: Coord, real: boolean) => void;

type DragState =
  | {
      dragging: false;
    }
  | {
      dragging: true;
      vertexId: VertexId;
      initialX: number;
      initialCoord: Coord;
      mouseX: number;
      real: boolean;
    };

type DragContext = {
  drag: DragState;
  beginDrag: BeginDrag;
};

const dragContext = createContext<DragContext>({
  drag: { dragging: false },
  beginDrag: () => {},
});

export const DragProvider = ({ children }: { children: React.ReactNode }) => {
  const [drag, setDrag] = useState<DragState>({ dragging: false });
  const dragRef = useRef(drag);

  useEffect(() => {
    dragRef.current = drag;
  }, [drag]);

  const beginDrag = (vertexId: VertexId, initialX: number, initialCoord: Coord, real: boolean) => {
    setDrag({
      dragging: true,
      vertexId,
      initialX,
      initialCoord,
      mouseX: initialX,
      real,
    });
  };

  const setMouseX = (mouseX: number) => {
    if (dragRef.current.dragging) {
      setDrag({
        ...dragRef.current,
        mouseX,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      setMouseX(event.clientX);
    });
    window.addEventListener("mouseup", () => {
      setDrag({ dragging: false });
    });

    return () => {
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("mouseup", () => {});
    };
  }, []);

  useEffect(() => {
    if (drag.dragging) {
      const delta = (drag.mouseX - drag.initialX) / 100;
      const newCoord = { x: drag.initialCoord.x, y: drag.initialCoord.y };
      if (drag.real) {
        newCoord.x = newCoord.x + delta;
      } else {
        newCoord.y += delta;
      }
      (
        getCurrentGraph().operation.implementation.find(
          (op) => op.id === drag.vertexId.operationId
        )! as EffectiveOperation
      ).exposedVertices[drag.vertexId.index].value = newCoord;
    }
  }, [drag]);

  return <dragContext.Provider value={{ drag, beginDrag }}>{children}</dragContext.Provider>;
};

export const useDrag = () => {
  return useContext(dragContext);
};
