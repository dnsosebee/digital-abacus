// import p5 from "p5";
import { canvasHeight, canvasWidth } from "@/lib/canvas";
import { SketchProps } from "react-p5/@types";

type p5 = Parameters<SketchProps["setup"]>[0];

export let p: p5 | null = null;

export function setup(p5: p5, canvasParentRef: Element) {
  p = p5;
  p5.createCanvas(canvasWidth(p!.windowWidth), canvasHeight(p!.windowHeight)).parent(
    canvasParentRef
  );
}

// TODO: commented this out since myLevels is not defined
// function keyPressed() {
//   //n for 'next'
//   if (p!.keyCode === 78 && p!.level != myLevels.length - 1) {
//     level++;
//   }

//   //p for 'previous'
//   if (keyCode === 80 && level != 0) {
//     level--;
//   }
// }

// let activeVertex: Vertex<Coord> | null = null;
