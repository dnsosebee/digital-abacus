import { draw, setup, touchEnded, touchMoved, touchStarted } from "@/model/sketch";
import dynamic from "next/dynamic";

// declare global {
//   setup: any,
//   draw: any,
// }

const DynamicSketch = dynamic(() => import("react-p5"), { ssr: false });

const Linkages = () => (
  <DynamicSketch
    setup={setup}
    draw={draw}
    touchStarted={touchStarted}
    touchMoved={touchMoved}
    touchEnded={touchEnded}
  />
);

export default Linkages;
