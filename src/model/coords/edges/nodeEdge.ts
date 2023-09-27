import { deserializeGraph } from "@/model/deserializeGraph";
import { z } from "zod";
import { Constraint, OperatorConstraint, StandaloneConstraint } from "../../graph/constraint";
import { UPDATE_IDEAL, UPDATE_ITERATIVE, iterations, searchSize, settings } from "../../settings";
import { p } from "../../setup";
import { Polar } from "../coord/coord";
import { DifferentialCoord } from "../coord/differentialCoord";
import { CoordVertex } from "../coordVertex";
import {
  CompositeOperation,
  serialCompositeOperationSchema,
} from "../operations/composites/compositeOperation";
import {
  IdealComplexAdder,
  IdealComplexConjugator,
  IdealComplexExponent,
  IdealComplexMultiplier,
} from "../operations/ideal";
import {
  IterativeComplexAdder,
  IterativeComplexConjugator,
  IterativeComplexExponent,
  IterativeComplexMultiplier,
} from "../operations/iterative";
import { CircuitEdge, serialCircuitEdgeSchema } from "./circuitEdge";

export const OP_TYPE = {
  ADDER: "adder" as const,
  MULTIPLIER: "multiplier" as const,
  CONJUGATOR: "conjugator" as const,
  EXPONENTIAL: "exponential" as const,
  STANDALONE: "standalone" as const,
  COMPOSITE: "composite" as const,
};

export const primitiveOpTypeSchema = z.union([
  z.literal(OP_TYPE.ADDER),
  z.literal(OP_TYPE.MULTIPLIER),
  z.literal(OP_TYPE.CONJUGATOR),
  z.literal(OP_TYPE.EXPONENTIAL),
  z.literal(OP_TYPE.STANDALONE),
]);

export const opTypeSchema = z.union([primitiveOpTypeSchema, z.literal("composite")]);

export type PrimitiveOpType = z.infer<typeof primitiveOpTypeSchema>;

export type OpType = z.infer<typeof opTypeSchema>;

// these should be in settings.js
export const STEP_SIZE = searchSize;
export const ITERATIONS = iterations;

export type CircuitPosition = { x: number; y: number };

const serialPrimitiveOperationSchema = z.object({
  primitive: z.literal(true),
  type: primitiveOpTypeSchema,
  bound: z.number().optional(),
});

const serialOperationSchema = z.union([
  serialPrimitiveOperationSchema,
  serialCompositeOperationSchema,
]);

export type SerialOperation = z.infer<typeof serialOperationSchema>;

export const serialNodeEdgeSchema = serialCircuitEdgeSchema.extend({
  operator: serialOperationSchema,
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  label: z.string(),
  hidden: z.boolean(),
});

export type SerialNodeEdge = z.infer<typeof serialNodeEdgeSchema>;

export class NodeEdge extends CircuitEdge {
  // :Edge<LinkagePoint>

  type: OpType; // :operator type
  hidden: boolean; // :whether to draw this operator in Linkages
  position: CircuitPosition;
  label: string;

  constructor(
    v: CoordVertex[],
    operationData: SerialOperation,
    mode: number,
    id: string,
    position: CircuitPosition,
    hidden = false,
    selected = false,
    label = ""
  ) {
    let constraint: Constraint<DifferentialCoord>;
    if (operationData.primitive) {
      constraint = getBaseConstraintByType(mode, operationData.type);
      if (operationData.bound != undefined) {
        if (constraint instanceof OperatorConstraint) {
          console.log("setting bound");
          constraint.bound = operationData.bound;
        } else {
          throw new Error("Bound vertex specified for non-operator constraint");
        }
      }
    } else {
      const subgraph = deserializeGraph(operationData.subgraph);
      constraint = new CompositeOperation(
        subgraph,
        operationData.interfaceVertexIds,
        // @ts-ignore
        operationData.boundArray || [operationData.bound],
        operationData.layout
      );
    }

    const type = operationData.primitive ? operationData.type : OP_TYPE.COMPOSITE;

    super(v, constraint as Constraint<DifferentialCoord>, id, selected);
    this.type = type;
    this.position = position;
    this.hidden = hidden;
    this.label = label;
  }

  serialize(): SerialNodeEdge {
    const serialized = super.serialize();
    let operator;
    if (this.type == OP_TYPE.COMPOSITE) {
      operator = (this.constraint as CompositeOperation).serialize();
    } else {
      operator = {
        primitive: true as const,
        type: this.type,
        bound: (this.constraint as OperatorConstraint<DifferentialCoord>).bound,
      };
    }
    return {
      ...serialized,
      operator: operator,
      hidden: this.hidden,
      position: this.position,
      label: this.label,
    };
  }

  setHidden(h: boolean) {
    this.hidden = h;
    this.vertices.forEach((v) => {
      v.hidden = h;
    });
  }

  // display connecting lines related to this operation
  // note: does not draw the vertices themselves
  displayLinkage() {
    if (this.hidden) {
      return;
    }
    p!.noFill();
    p!.strokeWeight(2);
    if (this.selected) {
      p!.strokeWeight(6);
    }

    if (this.type == OP_TYPE.ADDER) {
      p!.stroke(30, 200, 255);
      p!.beginShape();
      p!.vertex(settings.CENTER_X, settings.CENTER_Y);
      p!.vertex(this.vertices[0].value.getXPx(), this.vertices[0].value.getYPx());
      p!.vertex(this.vertices[2].value.getXPx(), this.vertices[2].value.getYPx());
      p!.vertex(this.vertices[1].value.getXPx(), this.vertices[1].value.getYPx());
      p!.vertex(settings.CENTER_X, settings.CENTER_Y);
      p!.endShape();
    } else if (this.type == OP_TYPE.MULTIPLIER) {
      p!.stroke(255, 0, 0);
      p!.line(
        settings.CENTER_X,
        settings.CENTER_Y,
        this.vertices[2].value.getXPx(),
        this.vertices[2].value.getYPx()
      );
      p!.stroke(255, 100, 0);
      p!.line(
        settings.CENTER_X,
        settings.CENTER_Y,
        this.vertices[0].value.getXPx(),
        this.vertices[0].value.getYPx()
      );
      p!.line(
        settings.CENTER_X,
        settings.CENTER_Y,
        this.vertices[1].value.getXPx(),
        this.vertices[1].value.getYPx()
      );
    } else if (this.type == OP_TYPE.CONJUGATOR) {
      p!.stroke(30, 30, 200);
      p!.line(
        settings.CENTER_X,
        settings.CENTER_Y,
        this.vertices[0].value.getXPx(),
        this.vertices[0].value.getYPx()
      );
      p!.line(
        settings.CENTER_X,
        settings.CENTER_Y,
        this.vertices[1].value.getXPx(),
        this.vertices[1].value.getYPx()
      );
      p!.line(
        this.vertices[0].value.getXPx(),
        this.vertices[0].value.getYPx(),
        this.vertices[1].value.getXPx(),
        this.vertices[1].value.getYPx()
      );
    } else if (this.type == OP_TYPE.EXPONENTIAL) {
      p!.stroke(220, 50, 220);
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
        settings.CENTER_X,
        settings.CENTER_Y,
        2 * settings.globalScale * this.vertices[1].value.getR(),
        2 * settings.globalScale * this.vertices[1].value.getR()
      );
    } else {
      // bad
    }
  }

  toString() {
    if (this.type == OP_TYPE.ADDER) {
      return (
        this.vertices[0].value.toString(0) +
        " + " +
        this.vertices[1].value.toString(0) +
        " = " +
        this.vertices[2].value.toString(0)
      );
    } else if (this.type == OP_TYPE.MULTIPLIER) {
      return (
        this.vertices[0].value.toString(0) +
        " x " +
        this.vertices[1].value.toString(0) +
        " = " +
        this.vertices[2].value.toString(0)
      );
    } else if (this.type == OP_TYPE.CONJUGATOR) {
      return (
        "conj" + this.vertices[0].value.toString(0) + " = " + this.vertices[1].value.toString(0)
      );
    } else if (this.type == OP_TYPE.EXPONENTIAL) {
      return (
        "exp" + this.vertices[0].value.toString(0) + " = " + this.vertices[1].value.toString(0)
      );
    }
  }
}

export function getBaseConstraintByType(mode: number, type: string) {
  let c = null;
  switch (mode) {
    case UPDATE_IDEAL:
      switch (type) {
        case OP_TYPE.ADDER:
          c = new IdealComplexAdder();
          break;
        case OP_TYPE.MULTIPLIER:
          c = new IdealComplexMultiplier();
          break;
        case OP_TYPE.CONJUGATOR:
          c = new IdealComplexConjugator();
          break;
        case OP_TYPE.EXPONENTIAL:
          c = new IdealComplexExponent(false);
          break;
        case OP_TYPE.STANDALONE:
          c = new StandaloneConstraint<DifferentialCoord>();
          break;
        default:
          console.log("Warning: Unsupported Operator Type");
          // c = new NonConstraint<Coord>(2);
          throw new Error("Unsupported Operator Type");
      }
      break;
    case UPDATE_ITERATIVE:
      switch (type) {
        case OP_TYPE.ADDER:
          c = new IterativeComplexAdder(ITERATIONS);
          break;
        case OP_TYPE.MULTIPLIER:
          c = new IterativeComplexMultiplier(ITERATIONS);
          break;
        case OP_TYPE.CONJUGATOR:
          c = new IterativeComplexConjugator(ITERATIONS);
          break;
        case OP_TYPE.EXPONENTIAL:
          c = new IterativeComplexExponent(ITERATIONS);
          break;
        case OP_TYPE.STANDALONE:
          c = new StandaloneConstraint<DifferentialCoord>();
          break;
        default:
          console.log("Warning: Unsupported Operator Type");
          // c = new NonConstraint<Coord>(2);
          throw new Error("Unsupported Operator Type");
      }
      break;
    // case UPDATE_DIFFERENTIAL:
    //   switch (type) {
    //     case OP_TYPE.ADDER:
    //       c = new DifferentialComplexAdder();
    //       break;
    //     case OP_TYPE.MULTIPLIER:
    //       c = new DifferentialComplexMultiplier();
    //       break;
    //     case OP_TYPE.CONJUGATOR:
    //       c = new DifferentialComplexConjugator();
    //       break;
    //     case OP_TYPE.EXPONENTIAL:
    //       c = new DifferentialComplexExponent();
    //       break;
    //     case OP_TYPE.STANDALONE:
    //       c = new StandaloneConstraint();
    //       break;
    //     default:
    //       console.log("Warning: Unsupported Operator Type");
    //       c = new NonConstraint<Coord>(2);
    //   }
    //   break;
    default:
      console.log("Warning: Invalid Update Mode");
      // c = new NonConstraint<Coord>(2);
      throw new Error(`Invalid Update Mode: ${mode}`);
  }
  return c;
}
