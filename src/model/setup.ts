// import p5 from "p5";
import { SketchProps } from "react-p5/@types";

type p5 = Parameters<SketchProps["setup"]>[0];

export let p: p5 | null = null;

export function setup(p5: p5, canvasParentRef: Element) {
  p = p5;
  p5.createCanvas(p.windowWidth / 2 - 66, p.windowHeight - 30).parent(canvasParentRef);
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
