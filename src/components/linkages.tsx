import { settings } from "@/model/settings";
import { draw, setup, touchEnded, touchMoved, touchStarted, windowResized } from "@/model/sketch";
import dynamic from "next/dynamic";

const DynamicSketch = dynamic(() => import("react-p5"), { ssr: false });

const Linkages = () => {
  const handleWheelEvent = (event: any) => {
    event.preventDefault();
    // logger.debug({ event, globalScale: settings.globalScale }, "mouseWheel");
    settings.globalScale *= 1 - event.deltaY / 1000;
    // logger.debug({ globalScale: settings.globalScale }, "mouseWheel result");
    // return false;
  };
  return (
    <div onWheel={handleWheelEvent}>
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
