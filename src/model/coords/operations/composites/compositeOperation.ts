import { z } from "zod";
import { Constraint, Eq } from "../../../graph/constraint";
import { VertexId, serialVertexIdSchema } from "../../../graph/vertex";
import { Coord } from "../../coord/coord";
import { DifferentialCoord } from "../../coord/differentialCoord";
import { CoordGraph } from "../../coordGraph";

export const BUILTIN_COMPOSITES = {
  SUBTRACTOR: "subtractor" as const,
  DIVIDER: "divider" as const,
  EXPONENT: "exponent" as const,
  RECIPROCAL: "reciprocal" as const,
  AVERAGE: "average" as const,
  NTH_ROOT: "nthRoot" as const,
  LOG: "log" as const,
  SIN: "sin" as const,
  COS: "cos" as const,
  TAN: "tan" as const,
  SINH: "sinh" as const,
  COSH: "cosh" as const,
  TANH: "tanh" as const,
  PI: "pi" as const,
  E: "e" as const,
  I: "i" as const,
  PHI: "phi" as const,
  LINEAR_SOLVER: "linearSolver" as const,
  CIRCLE_PLUS: "circlePlus" as const,
  GEOMETRIC_MEAN: "geometricMean" as const,
  HARMONIC_OSCILLATOR: "harmonicOscillator" as const,
  TEMPERATURE: "temperature" as const,
  DEGREES_TO_RADIANS: "degreesToRadians" as const,
} as const;

const topAndBottomLayoutSchema = z.object({
  type: z.literal("topAndBottom"),
  data: z.object({
    top: z.array(z.number()), // indices into edge.vertices
    bottom: z.array(z.number()), // indices into edge.vertices
  }),
});

const layoutSchema = topAndBottomLayoutSchema; //z.union([topAndBottomLayoutSchema]);

export type Layout = z.infer<typeof layoutSchema>;

export const builtinCompositeSchema = z.union([
  z.literal(BUILTIN_COMPOSITES.SUBTRACTOR),
  z.literal(BUILTIN_COMPOSITES.DIVIDER),
  z.literal(BUILTIN_COMPOSITES.EXPONENT),
  z.literal(BUILTIN_COMPOSITES.RECIPROCAL),
  z.literal(BUILTIN_COMPOSITES.AVERAGE),
  z.literal(BUILTIN_COMPOSITES.NTH_ROOT),
  z.literal(BUILTIN_COMPOSITES.LOG),
  z.literal(BUILTIN_COMPOSITES.SIN),
  z.literal(BUILTIN_COMPOSITES.COS),
  z.literal(BUILTIN_COMPOSITES.TAN),
  z.literal(BUILTIN_COMPOSITES.SINH),
  z.literal(BUILTIN_COMPOSITES.COSH),
  z.literal(BUILTIN_COMPOSITES.TANH),
  z.literal(BUILTIN_COMPOSITES.PI),
  z.literal(BUILTIN_COMPOSITES.E),
  z.literal(BUILTIN_COMPOSITES.I),
  z.literal(BUILTIN_COMPOSITES.PHI),
  z.literal(BUILTIN_COMPOSITES.LINEAR_SOLVER),
  z.literal(BUILTIN_COMPOSITES.CIRCLE_PLUS),
  z.literal(BUILTIN_COMPOSITES.GEOMETRIC_MEAN),
  z.literal(BUILTIN_COMPOSITES.HARMONIC_OSCILLATOR),
  z.literal(BUILTIN_COMPOSITES.TEMPERATURE),
  z.literal(BUILTIN_COMPOSITES.DEGREES_TO_RADIANS),
]);

export type BuiltinComposite = z.infer<typeof builtinCompositeSchema>;

const hasBoundArraySchema = z.object({
  boundArray: z.array(z.number()), // indices into edge.vertices
});

const hasBoundSchema = z.object({
  bound: z.number(),
});

const baseSerialCompositeOperationSchema = z.object({
  primitive: z.literal(false),
  subgraph: z.any(),
  interfaceVertexIds: z.array(serialVertexIdSchema),
  layout: layoutSchema.optional(),
});

export const serialCompositeOperationSchema = z.union([
  baseSerialCompositeOperationSchema.merge(hasBoundArraySchema),
  baseSerialCompositeOperationSchema.merge(hasBoundSchema),
]);

export type SerialCompositeOperation = z.infer<typeof serialCompositeOperationSchema>;

export class CompositeOperation extends Constraint<DifferentialCoord> {
  graph: CoordGraph;
  interfaceVertexIds: VertexId[];
  boundArray: number[];
  eq: Eq<DifferentialCoord>;
  layout?: Layout;

  constructor(
    graph: CoordGraph,
    interfaceVertexIds: VertexId[],
    boundArray: number[],
    layout?: Layout
  ) {
    // const cp = function (zOld: DifferentialCoord, zNew: DifferentialCoord) {
    //   return zOld.copy().mut_sendTo(zNew);
    // };
    // const check = (d: Coord[]) => true; // WARNING: MAYBE WRONG
    const arity = interfaceVertexIds.length;
    super(arity);
    this.eq = function (z1: Coord, z2: Coord) {
      return z1.equals(z2);
    };
    this.graph = graph;
    this.interfaceVertexIds = interfaceVertexIds;
    this.boundArray = boundArray;
    this.layout = layout;
  }

  update(data: DifferentialCoord[]): DifferentialCoord[] {
    data.forEach((d, i) => {
      const interfaceVertexId = this.interfaceVertexIds[i];
      const interfaceVertex = this.graph._getVertex(interfaceVertexId);
      interfaceVertex.value.mut_sendTo(d);
    });

    this.graph.update(1);

    return this.interfaceVertexIds.map((vertexId) => this.graph._getVertex(vertexId).value);
  }

  serialize(): SerialCompositeOperation {
    return {
      primitive: false,
      boundArray: this.boundArray,
      interfaceVertexIds: this.interfaceVertexIds,
      subgraph: this.graph.serialize(),
      layout: this.layout,
    };
  }

  invert(take: number, give: number) {
    const innerTake = this.interfaceVertexIds[take];
    const innerGive = this.interfaceVertexIds[give];
    const innerTakeVertex = this.graph._getVertex(innerTake);
    const innerGiveVertex = this.graph._getVertex(innerGive);
    if (!innerTakeVertex || !innerGiveVertex) {
      return false;
    }
    if (this.graph.invert(innerTakeVertex, innerGiveVertex)) {
      // logger.debug({ graph: JSON.parse(JSON.stringify(this.graph.edges[0])) }, "inverted");
      if (
        super.invert(take, give) &&
        this.boundArray.includes(take) &&
        !this.boundArray.includes(give)
      ) {
        this.boundArray = this.boundArray.map((i) => (i == take ? give : i));

        // logger.debug({ graph: JSON.parse(JSON.stringify(this.graph.edges[0])) }, "inverted");

        return true;
      }
      if (this.graph.invert(innerGiveVertex, innerTakeVertex)) {
        return false;
      }
      throw new Error("Failed to abort inversion");
    }
    return false;
  }

  getDependencies() {
    console.log(this.interfaceVertexIds, this.boundArray);
    const deps = super.getDependencies();
    this.boundArray.forEach((bound: number) => {
      deps[bound] = true;
    });
    console.log({boundArray: this.boundArray, deps})
    return deps;
  }
}
