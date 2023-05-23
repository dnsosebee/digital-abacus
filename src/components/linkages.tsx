import { getCurrentGraph } from "@/src2/model/useStore";
import {
  draw,
  p,
  setup,
  touchEnded,
  touchMoved,
  touchStarted,
  windowResized,
} from "@/src2/p5/linkages";

import dynamic from "next/dynamic";
import { createRef, useEffect } from "react";

const DynamicSketch = dynamic(() => import("react-p5"), { ssr: false });

const Linkages = () => {
  const divRef = createRef<HTMLDivElement>();
  const handleWheelEvent = (event: WheelEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const { linkagesSettings } = getCurrentGraph();
    const { centerX, centerY } = linkagesSettings;
    const magnitude = p!.dist(p!.mouseX, p!.mouseY, centerX, centerY);
    const angle = p!.atan2(centerY - p!.mouseY, centerX - p!.mouseX);

    const scaleFactor = 1 - event.deltaY / 1000;
    linkagesSettings.scale *= scaleFactor;
    linkagesSettings.centerX = p!.mouseX + scaleFactor * magnitude * p!.cos(angle);
    linkagesSettings.centerY = p!.mouseY + scaleFactor * magnitude * p!.sin(angle);
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
