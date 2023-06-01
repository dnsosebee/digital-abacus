import { settings } from "@/model/settings";
import { p, setup } from "@/model/setup";
import { draw, touchEnded, touchMoved, touchStarted, windowResized } from "@/model/sketch";
import dynamic from "next/dynamic";
import { createRef, useEffect } from "react";

const DynamicSketch = dynamic(() => import("react-p5"), { ssr: false });

const Linkages = () => {
  const divRef = createRef<HTMLDivElement>();
  const handleWheelEvent = (event: WheelEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const { CENTER_X, CENTER_Y } = settings;
    const magnitude = p!.dist(p!.mouseX, p!.mouseY, CENTER_X, CENTER_Y);
    const angle = p!.atan2(CENTER_Y - p!.mouseY, CENTER_X - p!.mouseX);

    const scaleFactor = Math.max(0.1, 1 - event.deltaY / 1000);
    settings.globalScale *= scaleFactor;
    settings.CENTER_X = p!.mouseX + scaleFactor * magnitude * p!.cos(angle);
    settings.CENTER_Y = p!.mouseY + scaleFactor * magnitude * p!.sin(angle);
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
    <div ref={divRef} className="cursor-grab">
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
