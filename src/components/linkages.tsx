import { settings } from "@/model/settings";
import { draw, setup, touchEnded, touchMoved, touchStarted, windowResized } from "@/model/sketch";
import dynamic from "next/dynamic";
import { createRef, useEffect } from "react";

const DynamicSketch = dynamic(() => import("react-p5"), { ssr: false });

const Linkages = () => {
  const divRef = createRef<HTMLDivElement>();
  const handleWheelEvent = (event: WheelEvent) => {
    event.stopPropagation();
    event.preventDefault();
    // logger.debug({ event, globalScale: settings.globalScale }, "mouseWheel");
    settings.globalScale *= 1 - event.deltaY / 1000;
    // logger.debug({ globalScale: settings.globalScale }, "mouseWheel result");
    // return false;
  };

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener("wheel", handleWheelEvent, { passive: false });
    }
    return () => {
      if (div) {
        div.removeEventListener("wheel", handleWheelEvent);
      }
    };
  }, [divRef]);

  return (
    <div ref={divRef}>
      <DynamicSketch
        setup={setup}
        draw={draw}
        touchStarted={touchStarted}
        touchMoved={touchMoved}
        touchEnded={touchEnded}
        windowResized={windowResized}
      />
    </div>
  );
};

export default Linkages;
