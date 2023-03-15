import dynamic from "next/dynamic";
import { useState } from "react";
import { SketchProps } from "react-p5";

// declare global {
//   setup: any,
//   draw: any,
// }

const DynamicSketch = dynamic(() => import("react-p5"), { ssr: false });

const Linkages = () => {
  const [state, setState] = useState<null | SketchProps>(null);

  if (typeof window !== "undefined" && state === null) {
    setState({
      setup: (window as any).setup,
      draw: (window as any).draw,
    });
  }

  return state === null ? (
    <p>Loading...</p>
  ) : (
    <DynamicSketch setup={state.setup} draw={state.draw} />
  );
};

export default Linkages;
