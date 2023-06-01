import { createContext, useContext, useEffect, useRef, useState } from "react";

type BeginDrag = (dragState: DragState) => void;

type DragState =
  | {
      dragging: false;
    }
  | {
      breakBeyond: number;
      dragging: true;
      initialX: number;
      currentX: number;
      basis: number;
      onMouseMove: (basis: number, delta: number) => void;
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
  const [broken, setBroken] = useState(false);
  const dragRef = useRef(drag);

  useEffect(() => {
    dragRef.current = drag;
  }, [drag]);

  const beginDrag = (dragState: DragState) => {
    setDrag(dragState);
    setBroken(false);
  };

  const setMouseX = (mouseX: number) => {
    if (dragRef.current.dragging) {
      setDrag({
        ...dragRef.current,
        currentX: mouseX,
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
      const delta = drag.currentX - drag.initialX;
      if ((delta > drag.breakBeyond || delta < 0 - drag.breakBeyond) && !broken) {
        setBroken(true);
      }
      if (broken) {
        drag.onMouseMove(drag.basis, delta);
      }
    }
  }, [drag]);

  return <dragContext.Provider value={{ drag, beginDrag }}>{children}</dragContext.Provider>;
};

export const useDrag = () => {
  return useContext(dragContext);
};
