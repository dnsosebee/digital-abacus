import { Constraint, NonConstraint, StandaloneConstraint } from "../../graph/constraint";
import { Edge } from "../../graph/edge";
import {
  CENTER_X,
  CENTER_Y,
  iterations,
  searchSize,
  settings,
  UPDATE_DIFFERENTIAL,
  UPDATE_IDEAL,
  UPDATE_ITERATIVE,
} from "../../settings";
import { p } from "../../sketch";
import { Coord, Polar } from "../coord/coord";
import { CoordVertex } from "../coordVertex";
import {
  DifferentialComplexAdder,
  DifferentialComplexConjugator,
  DifferentialComplexExponent,
  DifferentialComplexMultiplier,
  IdealComplexAdder,
  IdealComplexConjugator,
  IdealComplexExponent,
  IdealComplexMultiplier,
  IterativeComplexAdder,
  IterativeComplexConjugator,
  IterativeComplexExponent,
  IterativeComplexMultiplier,
} from "../operations";

// operator type
export const ADDER = 0;
export const MULTIPLIER = 1;
export const CONJUGATOR = 2;
export const EXPONENTIAL = 3;
export const STANDALONE = 4;

// export enum NodeType {
//   ADDER = "adder",
//   MULTIPLIER = "multiplier",
//   CONJUGATOR = "conjugator",
//   EXPONENTIAL = "exponential",
//   STANDALONE = "standalone",
// }

// these should be in settings.js
export const STEP_SIZE = searchSize;
export const ITERATIONS = iterations;

type CircuitPosition = { x: number; y: number };

export class NodeEdge extends Edge<Coord, CoordVertex> {
  // :Edge<LinkagePoint>

  type: number; // :operator type
  hidden: boolean; // :whether to draw this operator
  position: CircuitPosition;

  constructor(v: CoordVertex[], type: number, mode: number, id: string, position: CircuitPosition) {
    let c = null;
    switch (mode) {
      case UPDATE_IDEAL:
        switch (type) {
          case ADDER:
            c = new IdealComplexAdder();
            break;
          case MULTIPLIER:
            c = new IdealComplexMultiplier();
            break;
          case CONJUGATOR:
            c = new IdealComplexConjugator();
            break;
          case EXPONENTIAL:
            c = new IdealComplexExponent(false);
            break;
          case STANDALONE:
            c = new StandaloneConstraint();
            break;
          default:
            console.log("Warning: Unsupported Operator Type");
            c = new NonConstraint<Coord>(2);
        }
        break;
      case UPDATE_ITERATIVE:
        switch (type) {
          case ADDER:
            c = new IterativeComplexAdder(STEP_SIZE, ITERATIONS);
            break;
          case MULTIPLIER:
            c = new IterativeComplexMultiplier(STEP_SIZE, ITERATIONS);
            break;
          case CONJUGATOR:
            c = new IterativeComplexConjugator(STEP_SIZE, ITERATIONS);
            break;
          case EXPONENTIAL:
            c = new IterativeComplexExponent(STEP_SIZE, ITERATIONS);
            break;
          case STANDALONE:
            c = new StandaloneConstraint();
            break;
          default:
            console.log("Warning: Unsupported Operator Type");
            c = new NonConstraint<Coord>(2);
        }
        break;
      case UPDATE_DIFFERENTIAL:
        switch (type) {
          case ADDER:
            c = new DifferentialComplexAdder();
            break;
          case MULTIPLIER:
            c = new DifferentialComplexMultiplier();
            break;
          case CONJUGATOR:
            c = new DifferentialComplexConjugator();
            break;
          case EXPONENTIAL:
            c = new DifferentialComplexExponent();
            break;
          case STANDALONE:
            c = new StandaloneConstraint();
            break;
          default:
            console.log("Warning: Unsupported Operator Type");
            c = new NonConstraint<Coord>(2);
        }
        break;
      default:
        console.log("Warning: Invalid Update Mode");
        c = new NonConstraint<Coord>(2);
    }
    super(v, c as Constraint<Coord>, id);
    this.type = type;
    this.position = position;
    this.hidden = false;
  }

  // display connecting lines related to this operation
  // note: does not draw the vertices themselves
  displayLinkage() {
    if (this.hidden) {
      return;
    }
    p!.noFill();
    p!.strokeWeight(1);

    if (this.type == ADDER) {
      p!.stroke(30, 200, 255);
      p!.beginShape();
      p!.vertex(CENTER_X, CENTER_Y);
      p!.vertex(this.vertices[0].value.getXPx(), this.vertices[0].value.getYPx());
      p!.vertex(this.vertices[2].value.getXPx(), this.vertices[2].value.getYPx());
      p!.vertex(this.vertices[1].value.getXPx(), this.vertices[1].value.getYPx());
      p!.vertex(CENTER_X, CENTER_Y);
      p!.endShape();
    } else if (this.type == MULTIPLIER) {
      p!.stroke(255, 0, 0);
      p!.line(CENTER_X, CENTER_Y, this.vertices[2].value.getXPx(), this.vertices[2].value.getYPx());
      p!.stroke(255, 100, 0);
      p!.line(CENTER_X, CENTER_Y, this.vertices[0].value.getXPx(), this.vertices[0].value.getYPx());
      p!.line(CENTER_X, CENTER_Y, this.vertices[1].value.getXPx(), this.vertices[1].value.getYPx());
    } else if (this.type == CONJUGATOR) {
      p!.stroke(30, 30, 200);
      p!.line(CENTER_X, CENTER_Y, this.vertices[0].value.getXPx(), this.vertices[0].value.getYPx());
      p!.line(CENTER_X, CENTER_Y, this.vertices[1].value.getXPx(), this.vertices[1].value.getYPx());
      p!.line(
        this.vertices[0].value.getXPx(),
        this.vertices[0].value.getYPx(),
        this.vertices[1].value.getXPx(),
        this.vertices[1].value.getYPx()
      );
    } else if (this.type == EXPONENTIAL) {
      p!.stroke(200, 100, 200);
      if (this.vertices[0].dragging || this.vertices[1].dragging) {
        // still need to work out correct values for a and b
        let b = this.vertices[0].value.getX() / this.vertices[0].value.getY();
        let a = 1;
        let theta = -12 * p!.PI;
        p!.beginShape();
        for (let i = 0; i < 12000; i++) {
          theta += p!.PI / 100;
          if (b * theta < 5) {
            // don't try to plot coords further out than e^5
            let polar = new Polar(a * p!.exp(b * theta), theta);
            p!.vertex(polar.getXPx(), polar.getYPx());
          }
        }
        p!.endShape();
      }
      p!.line(this.vertices[0].value.getXPx(), 0, this.vertices[0].value.getXPx(), p!.height);
      p!.ellipse(
        CENTER_X,
        CENTER_Y,
        2 * settings.globalScale * this.vertices[1].value.getR(),
        2 * settings.globalScale * this.vertices[1].value.getR()
      );
    } else {
      // bad
    }
  }

  toString() {
    if (this.type == ADDER) {
      return (
        this.vertices[0].value.toString(0) +
        " + " +
        this.vertices[1].value.toString(0) +
        " = " +
        this.vertices[2].value.toString(0)
      );
    } else if (this.type == MULTIPLIER) {
      return (
        this.vertices[0].value.toString(0) +
        " x " +
        this.vertices[1].value.toString(0) +
        " = " +
        this.vertices[2].value.toString(0)
      );
    } else if (this.type == CONJUGATOR) {
      return (
        "conj" + this.vertices[0].value.toString(0) + " = " + this.vertices[1].value.toString(0)
      );
    } else if (this.type == EXPONENTIAL) {
      return (
        "exp" + this.vertices[0].value.toString(0) + " = " + this.vertices[1].value.toString(0)
      );
    }
  }
}